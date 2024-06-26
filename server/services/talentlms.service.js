require('dotenv').config();
const axios = require('axios');
var FormData = require('form-data');
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var talentlmsKey = process.env.TalentLMS_API_KEY;
var database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var talentlms = {
    signin:function(loginInfo, callback){
        var response = {"errorMessage":null, "results":null};
        /* loginInfo: { email, password }*/

        try {

            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err;
                    callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('mylgcu_users');
                    
                    db.find({ "email": loginInfo.email }).toArray(function(err, dbres){ 
                        client.close();

                        if(dbres.length <= 0){
                            response.errorMessage = "[Error] Email Address does not exist";
                            callback(response);
                        }
                        else {
                            var currentUser = dbres[0];

                            const basicAuth = Buffer.from(`${talentlmsKey}:`).toString('base64');
                            var data = new FormData();
                            data.append('login', currentUser.talentlmsId.login);
                            data.append('password', loginInfo.password);
                            
                            var config = {
                                method: 'post',
                                url: 'https://lenkesongcu.talentlms.com/api/v1/userlogin',
                                headers: { 
                                    'Authorization': `Basic ${basicAuth}`,
                                    ...data.getHeaders()
                                },
                                data : data
                            };

                            axios(config)
                            .then(function (ret) {
                                ret = ret.data;
                                if(ret.error){
                                    response.errorMessage = `[Error] with login information`;
                                    response.error = ret.error; console.log(ret.error);
                                }
                                else {
                                    response.results = ret;
                                    response.results._id = currentUser._id;      
                                    response.results.fullname = currentUser.fullname; 
                                    response.results.admin = currentUser.admin;                               
                                }   
                                callback(response);
                            })
                            .catch(function (error) {
                                console.log(error);
                                callback({ "errorMessage":'[Error] with signin call', "error":error });
                            });

                        }
                    });
                }
            });            
        }
        catch(ex){
            response.errorMessage = "[Error] with talentlms sign in (E09): "+ ex;
            callback(response);
        }
    },
    signup:function(userInfo, callback){
        var response = {"errorMessage":null, "results":null};
        var url = "https://lenkesongcu.talentlms.com/api/v1/usersignup";

        /* userInfo: { firstname, lastname, email, _id, retry} */
        try {
            var formData = {
                first_name: userInfo.firstname, last_name: userInfo.lastname,
                email: userInfo.email, login: "", password: ""
            };

            createTalentLMSLogin(userInfo, function(ret){
                if(ret.errorMessage){
                    callback(ret);
                }
                else {
                    formData.login = ret.results.login;
                    formData.password = ret.results.password;

                    axios.post(url, formData, { auth: { username: talentlmsKey, password: '' }})
                    .then(res => { 
                        addTalentLMSUserInfo(userInfo, res.data, callback);
                    })
                    .catch(error => { 
                        response.errorMessage = "[Error] unable to create TalentLMS User: " + error.message; 
                        callback(response);
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] with talentlms sign up (E09): "+ ex;
            callback(response);
        }
    },
    getUserById:function(userInfo, callback){
        var response = {"errorMessage":null, "results":null};
        var url = "https://lenkesongcu.talentlms.com/api/v1/users";

        try {
            url = url + "/id:"+userInfo.id;
            axios.get(url, { auth: { username: talentlmsKey, password: '' }})
            .then(res => { 
                if(!res.data){
                    response.errorMessage = "Unable to find user";
                }
                else {
                    response.results = {
                        id: res.data.id, login: res.data.login, firstname: res.data.first_name, lastname:res.data.last_name,
                        email: res.data.email, status: res.data.status, usertype: res.data.user_type, 
                        createdDate:res.data.created_on, courses: res.data.courses.filter(function(course){ return course.role == "learner" && course.completion_status != "completed"})
                    };
                }
                callback(response);
            })
            .catch(error => { 
                response.errorMessage = "[Error] getting talentlms user (E07): " + error.message; 
                callback(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error] getting talentlms user (E09): "+ ex;
            callback(response);
        }
    },
    getCourses:function(callback){
        var response = {"errorMessage":null, "results":null};
        var url = "https://lenkesongcu.talentlms.com/api/v1/courses";

        try {
            axios.get(url, { auth: { username: talentlmsKey, password: '' }})
            .then(res => { 
                var courseData = (res.data && res.data.length > 0 ? 
                    res.data
                    .filter(function(item){ 
                        return (item.status == 'active' && item.name != null && item.custom_field_2 != null && item.custom_field_3 != null); 
                    })
                    .map(function(d){
                        return { id:d.id, name:d.name, description: d.description, status: d.status,
                            credits: d.custom_field_1, courseCode: d.custom_field_2, courseId: d.custom_field_3};
                        }) : []);

                response.results = courseData; 
                callback(response);
            })
            .catch(error => { 
                response.errorMessage = "[Error] unable to create TalentLMS User: " + error.message; 
                callback(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error] getting talentlms courses (E09): "+ ex;
            callback(response);
        }
    },
    courseRegister(userInfo, courseInfo, callback){
        var response = {"errorMessage":null, "results":null};
        var url = "https://lenkesongcu.talentlms.com/api/v1/addusertocourse";

        try {
            var formData = { user_id: userInfo.talentlmsId.id, course_id: courseInfo.id, role:"learner" };

            axios.post(url, formData, { auth: { username: talentlmsKey, password: '' }})
                    .then(res => { 
                        if(!Array.isArray(res.data)){
                            response.errorMessage = res.data.error.message;
                        }
                        else {
                            response.results = res.data[0];
                        }
                        callback(response);
                    })
                    .catch(error => { 
                        response.errorMessage = "[Error] unable to registering student for course (E07): " + error.message; 
                        callback(response);
                    });
        }
        catch(ex){
            response.errorMessage = "[Error] registering student for course (E09): "+ ex;
            callback(response);
        }
    },
    courseUnregister(userInfo, courseInfo, callback) {
        var response = {"errorMessage":null, "results":null};
        var url = "https://lenkesongcu.talentlms.com/api/v1/removeuserfromcourse";

        try {
            url = url + "/user_id:"+userInfo.talentlmsId.id+",course_id:"+courseInfo.id;
            axios.get(url, { auth: { username: talentlmsKey, password: '' }})
            .then(res => { 
                if(res.data.error){
                    response.errorMessage = res.data.error.message;
                }
                else {
                    response.results = res.data;
                }
                callback(response);
            })
            .catch(error => { 
                response.errorMessage = "[Error] unable to unregister student from course: " + error.message; 
                callback(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error] unregistering student from course (E09): "+ ex;
            callback(response);
        }
    }
}

module.exports = talentlms;

function addTalentLMSUserInfo(userInfo, talentInfo, callback){
    var response = {"errorMessage":null, "results":null};

    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_users');
                response.results = {id: talentInfo.id, login: talentInfo.login};

                db.updateOne({ "_id": ObjectId(userInfo._id) }, { $set: { talentlmsId: response.results }
                            }, {upsert: true, useNewUrlParser: true});
                
                client.close();
                callback(response);
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] adding users talentlms info to user (E09): "+ ex;
        callback(response);
    }
}

function createTalentLMSLogin(userInfo, callback){
    var response = {"errorMessage":null, "results":null};

    try {
        var login = (userInfo.firstname && userInfo.firstname.length > 0 ? userInfo.firstname.charAt(0) : "L") + userInfo.lastname;
        login = login + (userInfo.retry && parseInt(userInfo.retry) > 0 ? userInfo.retry : "");

        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_users');
                
                db.find({ "_id": ObjectId(userInfo._id) }).toArray(function(err, res){ 
                    if(res.length <= 0){
                        response.errorMessage = "[Error] Invalid User Id";
                    }
                    else if(res[0].talentlmsId && (res[0].talentlmsId.id > 0 || res[0].talentlmsId.login.length > 0)){
                        response.errorMessage = "[Error] User Login Already Exists";
                    }
                    else {
                        response.results = {login: login, password: "LGCU-"+res[0].studentId};
                    }

                    client.close();
                    callback(response);
                });
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] creating talentlms login credentials (E09): "+ ex;
        callback(response);
    }
}