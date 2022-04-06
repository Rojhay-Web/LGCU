require('dotenv').config();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const nodemailer = require("nodemailer");
const util = require('util');

var database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var auth = {
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