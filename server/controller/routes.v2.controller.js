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
            utils.validateParam(["request_code", "card_info", "title", "description", "chargeItems", "email"], req.body);

            const ret = await charge.fullCharge(
                store, req.body.request_code, req.body.card_info, req.body.title, 
                req.body.description, req.body.chargeItems, req.body.email, req.body?.studentId
            );

            res.status(200).json(ret);
        }
        catch(ex){
            log.error(`Charging: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Charging: ${ex}` });
        }
    }

    async function lgcu_checkout(req, res){
        try {
            // Validate Params
            utils.validateParam(["request_code", "email", "chargeItems"], req.body);

            const ret = await charge.chargeCart(store, req.body.request_code, req.body.email, req.body.chargeItems, req.body?.studentId);
            res.status(200).json(ret);
        }
        catch(ex){
            log.error(`Generating Cart: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Generating Cart: ${ex}` });
        }
    }

    function lgcu_cart(req, res){
        try {
            console.log(" > S: ", req.params?.status);
            // console.log(req);

            res.status(200).json({ results: true });      
        }
        catch(ex){
            log.error(`running lgcu cart: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`lgcu cart: ${ex}` });
        }
    }

    function oauth_start(req, res){
        try {
            const ret = charge.oauth_redirect();

            if(ret.error){
                res.status(response.ERROR.BAD_REQUEST).json(ret);
            }
            else {
                log.debug(`redirecting to: ${ret.results}`);
                res.redirect(ret.results);
            }
        }
        catch(ex){
            log.error(`Running oauth start: ${ex}`);
            res.status(response.SERVER_ERROR.UNAVAILABLE).json({"error":`Start Oauth: ${ex}` });
        }
    }

    router.post('/sendEmail', sendEmail);

    /* Charges */
    router.get('/oauth-start', oauth_start);

    router.post('/lgcuCharge', lgcu_charge);
    router.post('/lgcuCheckout', lgcu_checkout);
    router.get('/lgcu-cart/:status', lgcu_cart);

    return router;
}