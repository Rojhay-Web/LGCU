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
                            db.insert(ret.results);
                            db.find({ 'email' : ret.results.email }).limit(1).toArray(function(err, res){ 
                                response.results = res[0];
                                callback(response);
                            });
                        }
                        else {
                            response.errorMessage = ret.errorMessage;  
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
                                { firstName: ret.results.firstName, lastName: ret.results.lastName, 
                                    email: ret.results.email, address: ret.results.address,
                                    degree: ret.results.degree
                                }
                            }, {upsert: true, useNewUrlParser: true});

                            db.find({ "_id": ObjectId(ret.results._id) }).limit(1).toArray(function(err, res){ 
                                response.results = res[0];
                                callback(response);
                            });
                        }
                        else {
                            response.errorMessage = ret.errorMessage;  
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
    userSearch:function(searchInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');                    
                    var idSearch = parseInt(searchInfo.query);
                    idSearch = (idSearch ? idSearch : searchInfo.query);

                    db.find({ $or:[
                        {'email' : new RegExp(searchInfo.query,'i') },
                        {'studentId' : idSearch },
                        {'firstName' : new RegExp(searchInfo.query,'i') },
                        {'lastName' : new RegExp(searchInfo.query,'i') }
                        ] }).toArray(function(err, res){ 
                            response.results = res;
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
    authorizeUser:function(userInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {

        }
        catch(ex){
            response.errorMessage = "[Error] Authorizing User (E09): "+ ex;
            callback(response);
        }
    },
    loginUser:function(userInfo,callback){
        var response = {"errorMessage":null, "results":null};

        try {

        }
        catch(ex){
            response.errorMessage = "[Error] Loging In User (E09): "+ ex;
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
                        var neccessaryItems = ["firstName", "lastName", "email"];
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
                            var newUser = { firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email,
                                address:userInfo.address, studentId:null, accountId:null, talentlmsId:null,
                                degree:{
                                    school:userInfo.degree.school, code:userInfo.degree.code, 
                                    major:userInfo.degree.major, declareDate: Date.now()
                                }
                            };
                            response.results = newUser;
                        }                        
                    }      
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
                        var neccessaryItems = ["firstName", "lastName", "email"];
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
                            // Create new user
                            var newUser = { firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email,
                                address:userInfo.address, _id:userInfo._id,
                                degree:{
                                    school:userInfo.degree.school, code:userInfo.degree.code, 
                                    major:userInfo.degree.major, declareDate: Date.now()
                                }
                            };
                            response.results = newUser;
                        }                        
                    }      
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