var express = require('express');
var router = express.Router();
var mail = require('../services/mail.service');

/* get events */
function sendEmail(req, res){ mail.sendEmail(req, res); }

/* Routes */
router.post('/sendEmail', sendEmail);

module.exports = router;