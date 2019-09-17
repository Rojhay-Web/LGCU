var express = require('express');
var router = express.Router();
/* Services */
var mail = require('../services/mail.service');
var charge = require('../services/charge.service');
var auth = require('../services/auth.service');

/* emails */
function sendEmail(req, res){ mail.sendEmail(req, res); }
function sendAppEmail(req, res){ mail.sendAppEmail(req, res); }

/* charges */
function applicationCharge(req, res){ charge.applicationCharge(req, res); }

/* user auth */
function createUser(req, res){
    var requestUser = req.body.requestUser;

    var userInfo = req.body.userInfo;
    // Validate User
    auth.createUser(userInfo, function(ret){
        res.status(200).json(ret);
    });
}

function updateUser(req, res){
    var requestUser = req.body.requestUser;

    var userInfo = req.body.userInfo;
    // Validate User
    auth.updateUser(userInfo, function(ret){
        res.status(200).json(ret);
    });
}

function userSearch(req, res){
    var requestUser = req.body.requestUser;

    var searchInfo = req.body.searchInfo;
    // Validate User
    auth.userSearch(searchInfo, function(ret){
        res.status(200).json(ret);
    });
}

function generateStudentId(req, res){
    var requestUser = req.body.requestUser;
    
    var userInfo = req.body.userInfo;
    // Validate User
    auth.generateStudentId(userInfo, function(ret){
        res.status(200).json(ret);
    });
}


/*** Routes ***/
/* User Auth */
router.post('/createUser', createUser);
router.post('/updateUser', updateUser);
router.post('/userSearch', userSearch);
router.post('/generateStudentId', generateStudentId);

/* Emails */
router.post('/sendEmail', sendEmail);
router.post('/sendAppEmail', sendAppEmail);

/* Charge */
router.post('/applicationCharge', applicationCharge);


module.exports = router;