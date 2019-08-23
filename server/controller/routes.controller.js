var express = require('express');
var router = express.Router();
var mail = require('../services/mail.service');
var charge = require('../services/charge.service');

/* get events */
function sendEmail(req, res){ mail.sendEmail(req, res); }
function sendAppEmail(req, res){ mail.sendAppEmail(req, res); }

function applicationCharge(req, res){ charge.applicationCharge(req, res); }

/* Routes */
/* Emails */
router.post('/sendEmail', sendEmail);
router.post('/sendAppEmail', sendAppEmail);

/* Charge */
router.post('/applicationCharge', applicationCharge);


module.exports = router;