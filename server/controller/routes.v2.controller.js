"use strict";
const express = require('express');
const router = express.Router();

/* Services */
let mail = require('../services/mail.v2.service'),
    charge = require('../services/charge.v2.service'),
    log = require('../services/log.service'),
    utils = require('../utils/utils'),
    response = require('../utils/responseCode');

module.exports = function(store) {
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

    async function lgcu_charge(req, res){
        try {
            // Validate Params
            utils.validateParam(["request_code", "card_info", "title", "description", "chargeItems"], req.body);

            const ret = await charge.charge(store, req.body.request_code, req.body.card_info, req.body.title, req.body.description, req.body.chargeItems, req.body?.studentId);
            res.status(200).json(ret);
        }
        catch(ex){
            log.error(`Charging: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Charging: ${ex}` });
        }
    }

    function oauth_start(req, res){
        try {
            const ret = charge.oauth_redirect();

            if(ret.error){
                res.status(response.ERROR.BAD_REQUEST).json(ret);
            }
            else {
                console.log(`redirecting to: ${ret.results}`);
                res.redirect(ret.results);
            }
        }
        catch(ex){
            log.error(`Running oauth start: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Start Oauth: ${ex}` });
        }
    }

    function oauth_store(req, res){
        try {
            if(req.query?.client_id === process.env.CLOVER_CLIENT_ID){
                res.status(200).json({ results: req.query?.code });
            }   
            else {
                res.status(200).json({ error: `Invalid Client ID` });
            }        
        }
        catch(ex){
            log.error(`running oauth store: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Storing oauth: ${ex}` });
        }
    }
    
    router.get('/test', (req, res)=> { res.status(200).json({ "return": "DONE"})});


    router.post('/sendEmail', sendEmail);

    /* Charges */
    router.get('/oauth-start', oauth_start);
    router.get('/oauth-store', oauth_store);
    router.post('/lgcuCharge', lgcu_charge);

    return router;
}