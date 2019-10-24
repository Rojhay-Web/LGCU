var express = require('express');
var router = express.Router();
/* Services */
var mail = require('../services/mail.service');
var charge = require('../services/charge.service');
var auth = require('../services/auth.service');
var talentlms = require('../services/talentlms.service');

/* emails */
function sendEmail(req, res){ 
    var emailInfo = req.body.emailInfo;

    mail.sendEmail(emailInfo, function(ret){
        res.status(200).json(ret);
    });
}
function sendAppEmail(req, res){ mail.sendAppEmail(req, res); }

/* charges */
function applicationCharge(req, res){ charge.applicationCharge(req, res); }

function createAuthNETAccount(req, res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;

    // Validate User (Admin Only)
    auth.authorizeUser(requestUser, null, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.getUserById(userInfo, function(ret0){
                if(ret0.errorMessage){
                    res.status(200).json(ret0);
                }
                else {            
                    charge.createAccount(ret0.results, function(ret){
                        res.status(200).json(ret);
                    });
                }
            });    
        }
    });         
}

function accountCharge(req, res){
    var userInfo = req.body.userInfo;
    var transactionInfo = req.body.transactionInfo;

    charge.accountCharge(userInfo, transactionInfo, function(ret){
        res.status(200).json(ret);
    });
}

function searchUserTransactions(req,res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;
    userInfo.full = true;
    
    // Validate User
    auth.getUserById(userInfo, function(ret){
        if(ret.errorMessage){
            res.status(200).json(ret);
        }
        else {
            charge.searchUserTransactions(ret.results.authTrans, function(searchRet) {
                res.status(200).json(searchRet);
            });
        }
    });

}
/* user auth */
function createUser(req, res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;

    // Validate User (Admin Only)
    auth.authorizeUser(requestUser, null, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.createUser(userInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });          
}

function updateUser(req, res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;

    // Validate User
    auth.authorizeUser(requestUser, userInfo._id, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.updateUser(userInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });         
}

function userSearch(req, res){
    var requestUser = req.body.requestUser;
    var searchInfo = req.body.searchInfo;

    // Validate User (Admin Only)
    auth.authorizeUser(requestUser, null, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.userSearch(searchInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });         
}

function getUserById(req, res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;

    // Validate User
    auth.authorizeUser(requestUser, userInfo._id, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.getUserById(userInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });      
}

function generateStudentId(req, res){
    var requestUser = req.body.requestUser;    
    var userInfo = req.body.userInfo;

    // Validate User
    auth.authorizeUser(requestUser, userInfo._id, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            auth.generateStudentId(userInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });  
}

/* TalentLMS */
function createTLMSUser(req, res){
    var requestUser = req.body.requestUser;    
    var userInfo = req.body.userInfo;

    // Validate User
    auth.authorizeUser(requestUser, null, function(ret){
        if(ret.errorMessage != null) {
            res.status(200).json(ret);
        }
        else if(!ret.results) {
            res.status(200).json({"errorMessage":"User status invalid for this request", "results":null});
        }
        else {
            talentlms.signup(userInfo, function(ret){
                res.status(200).json(ret);
            });
        }
    });  
}

function userLogin(req, res){    
    var loginInfo = req.body.loginInfo;
    
    talentlms.signin(loginInfo, function(ret){
        res.status(200).json(ret);
    });
}

function getTLMSUserById(req, res){
    var requestUser = req.body.requestUser;    
    var userInfo = req.body.userInfo;

    // Validate User
    talentlms.getUserById(userInfo, function(ret){
        res.status(200).json(ret);
    });
}

function getCourses(req, res){
    talentlms.getCourses(function(ret){
        res.status(200).json(ret);
    });
}

function courseRegister(req, res){
    var requestUser = req.body.requestUser;
    var userInfo = req.body.userInfo;
    var courseInfo = req.body.courseInfo;

    // Validate User
    talentlms.courseRegister(userInfo, courseInfo,function(ret){
        if(ret.errorMessage){
            //Send error email
            //"admin@lenkesongcu.org"
            mail.sendEmail({ email: "kris.redding3@gmail.com", title:"Registration Error", formData:{}, additionalData:{},
                subject:"Unable to Register student for course [ID]: "+courseInfo.id +" [student Id]:"+userInfo.studentId+" Error: "+ ret.errorMessage
                }, function(ret){});
        }

        res.status(200).json(ret);
    });
}

/*** Routes ***/
/* TalentLMS */
router.post('/createTLMSUser', createTLMSUser);
router.post('/userLogin', userLogin);
router.post('/getTLMSUserById', getTLMSUserById);
router.get('/getCourses', getCourses);
router.post('/courseRegister', courseRegister);

/* User Auth */
router.post('/createUser', createUser);
router.post('/updateUser', updateUser);
router.post('/userSearch', userSearch);
router.post('/getUserById', getUserById);
router.post('/generateStudentId', generateStudentId);

/* Emails */
router.post('/sendEmail', sendEmail);
router.post('/sendAppEmail', sendAppEmail);

/* Charge */
router.post('/applicationCharge', applicationCharge);
router.post('/createAuthNETAccount', createAuthNETAccount);
router.post('/accountCharge', accountCharge);
router.post('/searchUserTransactions',searchUserTransactions);

module.exports = router;