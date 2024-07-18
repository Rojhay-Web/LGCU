"use strict";
const express = require('express');
const router = express.Router();

/* Services */
let mail = require('../services/mail.v2.service'),
    log = require('../services/log.service'),
    utils = require('../utils/utils');

module.exports = function() {
    async function sendEmail(req, res){
        try {
            // Validate Params
            utils.validateParam(["subject", "content"], req.body);

            const ret = await mail.sendEmail(req.body.subject, req.body.content, req.body?.toEmail);
            res.status(200).json(ret);
        }
        catch(ex){
            log.error(`Sending Email: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Sending Email: ${ex}` });
        }
    }

    router.post('/sendEmail', sendEmail);
    return router;
}