require('dotenv').config();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
const fns = require('date-fns');
const CsvParser = require("json2csv").Parser;

const util = require('util');

var database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var auth = {
    paramCheck(params, obj) {
        var ret = true;
        try {
            if(!obj){
                ret = false;
            }
            else{
                for(var i = 0; i < params?.length; i++){
                    if(!(params[i] in obj) || obj[params[i]] == null){
                        console.log(params[i], " is missing ");
                        ret = false;
                        break;
                    }
                }
            }
        }
        catch(ex){
            console.log("checking params");
            ret = false;
        }
        return ret;
    },
    lgcuCheck(callback){
        var response = {"errorMessage":null, "results":true};
        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    console.log(`[Error] LGCU Check (E01): ${err}`);
                    client.close(); callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');                    
                    db.find({})
                        .project({studentId:1})
                        .toArray(function(err, res){ 
                            if(err) {
                                response.results = false; response.errorMessage = err;
                                console.log(`[Error] LGCU Check (E03): ${err}`);
                            }
                            else {
                                response.results = (res.length > 0);
                            }
                            client.close(); callback(response);
                        });            
                }
            });
        }
        catch(ex){
            response.errorMessage = `[Error] LGCU Check (E09): ${ex}`;
            console.log(response.errorMessage); callback(response);
        }
    },
    createUser:function(userInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');
                    
                    validateNewUser(userInfo, function(ret){
                        if(ret.errorMessage == null){
                            db.insertOne(ret.results, function(insertError,retObj){
                                if(insertError){
                                    response.error = insertError;
                                    client.close();                            
                                    callback(response);
                                }
                                else {                    
                                    db.find({ 'email' : ret.results.email }).limit(1).toArray(function(err, res){ 
                                        response.results = res[0];
                                        client.close();
                                        callback(response);
                                    });                                                                                
                                }                               
                            });
                            
                        }
                        else {
                            response.errorMessage = ret.errorMessage;  
                            client.close();
                            callback(response);                          
                        }
                    });                    
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Creating User (E09): "+ ex;
            callback(response);
        }
    },
    updateUser:function(userInfo, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');
                    
                    validateExistingUser(userInfo, function(ret){
                        if(ret.errorMessage == null){
                            db.updateOne({ "_id": ObjectId(ret.results._id) },  
                            { $set: 
                                { firstname: ret.results.firstname, lastname: ret.results.lastname, fullname: ret.results.fullname,
                                    email: ret.results.email, address: ret.results.address, phone: ret.results.phone,
                                    admin: ret.results.admin, military: ret.results.military, degree: ret.results.degree,
                                    studentInfo: ret.results.studentInfo 
                                }
                            }, {upsert: true, useNewUrlParser: true});

                            db.find({ "_id": ObjectId(ret.results._id) }).limit(1).toArray(function(err, res){ 
                                response.results = res[0];
                                client.close();
                                callback(response);
                            });
                        }
                        else {
                            response.errorMessage = ret.errorMessage; 
                            client.close(); 
                            callback(response);                          
                        }
                    });                    
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Updating User (E09): "+ ex;
            callback(response);
        }
    },
    getUserById:function(userInfo,callback){
        var response = {"errorMessage":null, "results":null};

        /* userInfo: { _id, full:bool} */
        try {

            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');                    

                    if(userInfo.full){
                        db.find({ "_id": ObjectId(userInfo._id)}).limit(1).toArray(function(err, res){ 
                            if(res && res.length > 0){
                                response.results = res[0];
                            }
                            else {
                                response.errorMessage = "Unable to get user by this id";
                            }
                            client.close();
                            callback(response);
                        });
                    }
                    else {
                        db.find({ "_id": ObjectId(userInfo._id)}).project({_id:1, studentId:1, firstname:1, lastname:1, admin:1})
                        .limit(1).toArray(function(err, res){ 
                            if(res && res.length > 0){
                                response.results = res[0];
                            }
                            else {
                                response.errorMessage = "Unable to get user by this id";
                            }
                            client.close();
                            callback(response);
                        });
                    }
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Getting User By Id (E09): "+ ex;
            callback(response);
        }
    },
    userSearch:function(searchInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {

            /* searchInfo: { query }*/
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    client.close();
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');                    
                    var idSearch = parseInt(searchInfo.query);
                    idSearch = (idSearch ? idSearch : searchInfo.query);

                    db.find({ $or:[
                        {'email' : new RegExp(searchInfo.query,'i') },
                        {'studentId' : idSearch },
                        {'firstname' : new RegExp(searchInfo.query,'i') },
                        {'lastname' : new RegExp(searchInfo.query,'i') },
                        {'fullname' : new RegExp(searchInfo.query,'i') }
                        ] })
                        .project({_id:1, studentId:1, fullname:1, email:1, admin:1})
                        .toArray(function(err, res){ 
                            response.results = res;
                            client.close();
                            callback(response);
                    });            
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Searching For User (E09): "+ ex;
            callback(response);
        }
    },
    authorizeUser:function(requestUser, userId, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    client.close();
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');  

                    db.find({ "_id": ObjectId(requestUser._id)}).project({_id:1, admin:1}).limit(1).toArray(function(err, res){ 
                        if(res && res.length > 0){
                            response.results = (res[0].admin == true || requestUser._id == userId);
                        }
                        else {
                            response.errorMessage = "Unable to get user by this id";
                        }
                        client.close();
                        callback(response);
                    });                              
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Authorizing User (E09): "+ ex;
            callback(response);
        }
    },
    /* Generate Ids */
    generateStudentId:function(userInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    client.close();
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');  

                    var maxId = db.find({}).project({_id:0, studentId:1 }).sort({ studentId:-1 }).limit(1).toArray(function(err, res){ 
                        var maxId = (res && res.length > 0 ? res[0].studentId : 1000);
                        var newId = maxId+1;

                        /* Clear unwanted number from ID's */
                        while(newId.toString().indexOf("666") >= 0){
                            newId += 1;
                        }

                        // Set ID To User
                        db.updateOne({ "_id": ObjectId(userInfo._id) },  { $set: {studentId: newId }}, {upsert: true, useNewUrlParser: true});

                        response.results = newId;
                        client.close();
                        callback(response);
                    });                   
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Generating User Id (E09): "+ ex;
            callback(response);
        }
    },
    /* Student Applications */
    submitStudentApp: function(applicationForm, callback){
        let response = {};
        try {
            // Validate App Form: applicationForm
            let formValidation = validateStudentApplication(applicationForm);
            if(formValidation.length > 0){
                callback({ "error": `Missing Fields: ${formValidation.join(", ")}` })
            }
            else {
                mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                    if(err) {
                        response.errorMessage = err;
                        callback(response);
                    }
                    else {
                        const db = client.db(database.dbName).collection('mylgcu_apps'), 
                            studentApp = buildStudentAppList(applicationForm);

                        db.insertOne(studentApp, function(insertError,retObj){
                            if(insertError || retObj.ops.length <= 0){
                                console.log(insertError ?? "Unable to Insert into DB");
                                response["error"] = "Unable to add student application [Please contact site admin]";
                            } else {                    
                                response["results"] = true;                                                                                
                            }
                            
                            client.close(); callback(response);
                        });
                    }
                });
            }
        }
        catch(ex){
            console.log(`Error Submitting User App: ${ex}`);
            callback({ "error": `Error Submitting User App: ${ex}`});
        }
    },
    getStudentAppCount: function(startDt, callback){
        try {
            getStudentApps(startDt, true, function(ret){
                if(ret.error){
                    callback(ret);
                }
                else {
                    callback({ results: ret.results.length });
                }
            });
        }
        catch(ex){
            console.log(`Error Submitting User App: ${ex}`);
            callback({ "error": `Error Submitting User App: ${ex}`});
        }
    },
    downloadStudentApps: function(startDt, callback){
        try {
            getStudentApps(startDt, false, function(ret){
                if(ret.error){
                    callback(ret);
                }
                else {
                    const csvData = [];
                    ret.results.forEach((item) => {
                        csvData.push({ 
                            "firstName" : cleanCSVField(item, "firstName"),
                            "middleName" : cleanCSVField(item, "middleName"),
                            "lastName" : cleanCSVField(item, "lastName"),
                            "email" : cleanCSVField(item, "email"),
                            "address" : cleanCSVField(item, "address"),
                            "city" : cleanCSVField(item, "city"),
                            "state" : cleanCSVField(item, "state"),
                            "postal" : cleanCSVField(item, "postal"),
                            "dayphone" : cleanCSVField(item, "dayphone"),
                            "eveningphone" : cleanCSVField(item, "eveningphone"),
                            "mobilephone" : cleanCSVField(item, "mobilephone"),
                            "ssn" : cleanCSVField(item, "ssn"),
                            "driverlicense" : cleanCSVField(item, "driverlicense"),

                            "emergencyname" : cleanCSVField(item, "emergencyname"),
                            "emergencyrelationship" : cleanCSVField(item, "emergencyrelationship"),
                            "emergencyphone" : cleanCSVField(item, "emergencyphone"),
                            "emergencyaddress" : cleanCSVField(item, "emergencyaddress"),
                            "emergencycity" : cleanCSVField(item, "emergencycity"),
                            "emergencystate" : cleanCSVField(item, "emergencystate"),
                            "emergencypostal" : cleanCSVField(item, "emergencypostal"),

                            "degreeType" : cleanCSVField(item, "degreeType"),
                            "veteran" : cleanCSVField(item, "veteran"),
                            "veteranbranch" : cleanCSVField(item, "veteranbranch"),
                            "veteranskill" : cleanCSVField(item, "veteranskill"),

                            "highestdegree" : cleanCSVField(item, "highestdegree"),
                            "otherdegrees" : cleanCSVField(item, "otherdegrees"),
                            "employmenthistory" : cleanCSVField(item, "employmenthistory")
                        });

                    });

                    const csvFields = [
                        "First Name", "Middle Name", "Last Name", "Email", "Address",
                        "City", "State", "Postal Code", "Daytime Phone", "Evening Phone",
                        "Mobile Phone", "SSN", "Drivers License", "Emergency Contact Name", "Emergency Contact Relationship",
                        "Emergency Contact Phone", "Emergency Contact Address", "Emergency Contact City", "Emergency Contact State", "Emergency Contact Postal Code",
                        "Degree Type", "Is Veteran", "Branch", "Specific Skills Acquired", "Highest Degree Earned",
                        "Other Degrees", "Employment History"
                    ];

                    const csvParser = new CsvParser({ csvFields });
                    const csvParserData = csvParser.parse(csvData);

                    callback({ "results": csvParserData });
                }
            });
        }
        catch(ex){
            console.log(`Error Submitting User App: ${ex}`);
            callback({ "error": `Error Submitting User App: ${ex}`});
        }
    }
}

module.exports = auth;

function validateNewUser(userInfo, callback){
    var response = {"errorMessage":null, "results":null};
    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_users');             

                db.find({ 'email' : userInfo.email }).toArray(function(err, res){     
                    
                    if(res && res.length > 0){
                        // User with email address already exists
                        response.errorMessage ="[Error] Validating New User (E11): User with email address already exists";
                    }
                    else {
                        var neccessaryItems = ["firstname", "lastname", "email"];
                        var errorList = [];
                        
                        neccessaryItems.forEach(function(item){
                            if(!(item in userInfo) || (!userInfo[item] || userInfo[item].length == 0)){
                                errorList.push(item);
                            }
                        });

                        if(errorList.length > 0){
                            response.errorMessage ="[Error] Validating New User (E13): The following fields are not valid " + errorList.join(",");
                        }
                        else {
                            // Create new user
                            var newUser = { firstname: userInfo.firstname, lastname: userInfo.lastname, fullname: userInfo.firstname + " " + userInfo.lastname, email: userInfo.email,
                                address:userInfo.address, phone: userInfo.phone, admin: false, studentId:null, accountId:null, 
                                admin: userInfo.admin, military: userInfo.military,
                                talentlmsId:{id:"", login:""}, studentInfo:{gpa:0, credits:0},
                                degree:{
                                    school:userInfo.degree.school, code:userInfo.degree.code, 
                                    major:userInfo.degree.major, level: userInfo.degree.level, declareDate: Date.now()
                                }
                            };
                            response.results = newUser;
                        }                        
                    }      
                    client.close();
                    callback(response);
                });  
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] Validating New User (E15): "+ ex;
        callback(response);
    }
}

function validateExistingUser(userInfo, callback){
    var response = {"errorMessage":null, "results":null};
    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_users');             

                db.find({ $and: [{'email' : userInfo.email}, { $not: {'_id': ObjectId(userInfo._id)}}] }).toArray(function(err, res){     
                    if(res && res.length > 0){
                        // User with email address already exists
                        response.errorMessage ="[Error] Validating Existing User (E11): User with email address already exists";
                    }
                    else {
                        var neccessaryItems = ["firstname", "lastname", "email"];
                        var errorList = [];
                        
                        neccessaryItems.forEach(function(item){
                            if(!(item in userInfo) || (!userInfo[item] || userInfo[item].length == 0)){
                                errorList.push(item);
                            }
                        });

                        if(errorList.length > 0){
                            response.errorMessage ="[Error] Validating Existing User (E13): The following fields are not valid " + errorList.join(",");
                        }
                        else {
                            if(userInfo.studentInfo) {
                                userInfo.studentInfo.gpa = (userInfo.gpa ? userInfo.gpa : 0);
                            }
                            
                            // Create new user
                            var newUser = { firstname: userInfo.firstname, lastname: userInfo.lastname, email: userInfo.email,
                                address:userInfo.address, phone: userInfo.phone, _id:userInfo._id, fullname: userInfo.firstname + " " + userInfo.lastname,
                                admin: userInfo.admin, military: userInfo.military, studentInfo:userInfo.studentInfo,
                                degree:{
                                    school:userInfo.degree.school, code:userInfo.degree.code, 
                                    major:userInfo.degree.major, level: userInfo.degree.level, declareDate: Date.now()
                                }
                            };

                            response.results = newUser;
                        }                        
                    }      
                    client.close();
                    callback(response);
                });  
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] Validating Existing User (E15): "+ ex;
        callback(response);
    }
}

function validateStudentApplication(appForm){
    let ret = [];
    try {
        let requiredFields = ["firstName","lastName", "email", "state", "postal", "ssn", "degreeType"];

        for(let i=0; i < requiredFields.length; i++){
            if(!appForm[requiredFields[i]] || appForm[requiredFields[i]]?.value.length === 0){
                ret.push(requiredFields[i]);
            }
        }
    }
    catch(ex){
        console.log(`Error Validationg Student Application: ${ex}`);
    }
    return ret;
}

function buildStudentAppList(appForm){
    let ret = {};
    try {
        let keyList = Object.keys(appForm);
        keyList.forEach((key) => {
            ret[key] = appForm[key].value;
        });

        // Encrypt SSN
        ret.ssn = cryptText(ret.ssn, true);

        // Set Apply Date
        ret.applyDate = (new Date()).getTime();
    }
    catch(ex){
        console.log(`Error Building Student App List: ${ex}`);
    }
    return ret;
}

function cryptText(text, encrypt=true){
    let ret = text;
    try {
        if(encrypt){
            let mykey = crypto.createCipher('aes-128-cbc', process.env.LGCU_SECRET);
            ret = mykey.update(text, 'utf8', 'hex');
            ret += mykey.final('hex');
        }
        else {
            var mykey = crypto.createDecipher('aes-128-cbc',  process.env.LGCU_SECRET);
            ret = mykey.update(text, 'hex', 'utf8')
            ret += mykey.final('utf8');
        }
    }
    catch(ex){
        console.log(`Error Crypting Text: ${ex}`);
    }
    return ret;
}

function getStudentApps(start_dt, hideSSN=false, callback){
    let response = { "error":"", "results":[] };
        try {
            if(isNaN(new Date(start_dt))){
                callback({ "error": `Invalid start date` })
            }
            else {
                mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                    if(err) {
                        response.errorMessage = err;
                        callback(response);
                    }
                    else {
                        const db = client.db(database.dbName).collection('mylgcu_apps'), 
                            startDt = fns.startOfDay(new Date(start_dt));

                        db.find({ applyDate: { $gte: startDt.getTime() }  })
                            .toArray(function(err,res){
                                if(err) { 
                                    response.error = `[Error] Retrieving Student Apps: ${err}`;
                                    callback(response); 
                                }
                                else {
                                    response.results = res.map(function(rs){
                                        rs.ssn = (hideSSN ? "" : cryptText(rs.ssn, false));
                                        return rs;
                                    });

                                    callback(response);
                                }
                            });
                    }
                });
            }
        }
        catch(ex){
            console.log(`Error Getting User Apps: ${ex}`);
            callback({ "error": `Error Getting User Apps: ${ex}`});
        }
}

function cleanCSVField(item, name){
    return  name in item ? item[name] : "";
}