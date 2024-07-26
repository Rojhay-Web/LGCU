require('dotenv').config();
const log = require('./log.service');

const clover_paths = {
    "dev":{
        "base":"https://sandbox.dev.clover.com",
        "oauth":"https://apisandbox.dev.clover.com",
        "payment":"https://scl-sandbox.dev.clover.com",
        "token":"https://token-sandbox.dev.clover.com",
        "redirect":"http://localhost:2323/v2/api/oauth-store"
    },
    "prod":{
        "base":"", "oauth":"", "payment":"", "token":"", "redirect":""
    }
};

module.exports = {
    oauth_redirect: function(){
        try {
            let url = `${clover_paths[process.env.CLOVER_ENV].base}/oauth/v2/authorize?client_id=${process.env.CLOVER_CLIENT_ID}&redirect_uri=${clover_paths[process.env.CLOVER_ENV].redirect}`;
            return { results: url };
        }
        catch(ex){
            log.error(`OAuth Redirect: ${ex}`);
            return { error: `OAuth Redirect: ${ex}` };
        }
    },
    charge: async function(store, request_code, cardInfo, title, description, chargeItems, studentId=null){
        try {
            // Get Oauth Token
            let oauthToken = store.searchCacheStore('clover_access_token');
            if(!oauthToken) {
                const oauthTokenRes = GetOAuthToken(request_code);
                if(oauthTokenRes.error) { throw oauthTokenRes.error; }

                // Store In Cache
                oauthToken = oauthTokenRes.results.access_token;
                store.updateCacheStore('clover_access_token', oauthToken, oauthTokenRes.results.access_token_expiration);
            }                    

            // Get Api Access Key (pakms)
            let apiKey = store.searchCacheStore('clover_api_key');
            if(!apiKey) {
                const apiKeyRes = GetAPIKey(oauthToken);
                if(apiKeyRes.error) { throw apiKeyRes.error; }
                
                // Store In Cache
                apiKey = apiKeyRes.results.apiAccessKey;
                store.updateCacheStore('clover_api_key', apiKey, null);
            }

            // Create Card Token
            const cardToken = CreateCardToken(apiKey, cardInfo);
            if(cardToken.error) { throw cardToken.error; }

            // Create Order
            const orderInfo = CreateOrder(oauthToken, title, description, chargeItems);
            if(orderInfo.error) { throw orderInfo.error; }

            // Order Payment
            const orderPayStatus = OrderPayment(orderInfo.id, cardToken.id);
            if(orderPayStatus.error) { throw orderPayStatus.error; }

            // TODO: Send Charge Receipt
            if(studentId){
                // TODO: Add Transaction Info to User
            }

            return { results: orderPayStatus.status };
        }
        catch(ex){
            log.error(`Charging Card: ${ex}`);
            return { error: `Charging Card: ${ex}` };
        }
    }
}

/* Private Methods */
async function GetOAuthToken(code){
    try {
        let url = `${clover_paths[process.env.CLOVER_ENV].oauth}/oauth/v2/token`;
        const post_data = {
            client_id: process.env.CLOVER_CLIENT_ID,
            client_secret: process.env.CLOVER_CLIENT_SECRET,
            code: code
        };

        let dataRet = await fetch(url, { method: 'POST', body: post_data });
        if(dataRet.status != 200) {
            log.error(`Getting Clover OAuth Token: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet };
    }
    catch(ex){
        log.error(`Getting Oauth Token: ${ex}`);
        return { error: `Getting Oauth Token: ${ex}` };
    }
}

async function GetAPIKey(authToken){
    try {
        let url = `${clover_paths[process.env.CLOVER_ENV].payment}/pakms/apikey`;

        let dataRet = await fetch(url, { 
            method: 'GET',
            headers: {
                "Content-Type":"application/json", 
                "Authentication": `Bearer ${authToken}`
            }
        });
        if(dataRet.status != 200) {
            log.error(`Getting Clover API Key: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet };
    }
    catch(ex){
        log.error(`Getting API Key: ${ex}`);
        return { error: `Getting API Key: ${ex}` };
    }
}

async function CreateCardToken(apiKey, cardInfo){
    try {
        // TODO: Validate Card Info Object
        let url = `${clover_paths[process.env.CLOVER_ENV].token}/v1/tokens`;
        const post_data = {
           "number": cardInfo.number,
            "exp_month": cardInfo.exp_month,
            "exp_year": cardInfo.exp_year,
            "cvv": cardInfo.cvv,
            "last4":cardInfo.number.slice(-4),
            "first6":cardInfo.number.slice(0,6),
            "country":cardInfo.country,
            "brand":cardInfo.brand,
            "name":cardInfo.name,
            "address_line1":cardInfo.address,
            "address_city":cardInfo.city,
            "address_state":cardInfo.state,
            "address_zip":cardInfo.zip,
            "address_country":cardInfo.country
        };

        let dataRet = await fetch(url, { 
            method: 'POST', body: post_data,
            headers: {
                "Content-Type":"application/json", "apikey": apiKey
            }
        });
        if(dataRet.status != 200) {
            log.error(`Getting Clover Card Token: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet.id };
    }
    catch(ex){
        log.error(`Getting Card Token: ${ex}`);
        return { error: `Getting Card Token: ${ex}` };
    }
}

async function CreateOrder(authToken, title, description, chargeItems){
    try {
        // TODO: Validate/Transform Charge Items
        const line_items = [...chargeItems];

        // TODO: GET Order Type
        const order_type_id = "87T2P17PAC26Y";

        let url = `${clover_paths[process.env.CLOVER_ENV].base}/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/atomic_order/orders`;
        const post_data = {
            orderCart:{
                title: title, note: description, 
                line_items: line_items, orderType: { id: order_type_id }
            }
        };

        let dataRet = await fetch(url, { 
            method: 'POST', body: post_data,
            headers: {
                "Content-Type":"application/json", 
                "Authentication": `Bearer ${authToken}`
            }
        });

        if(dataRet.status != 200) {
            log.error(`Creating Clover Order: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet };
    }
    catch(ex){
        log.error(`Creating Clover Order: ${ex}`);
        return { error: `Creating Clover Order: ${ex}` };
    }
}

async function OrderPayment(orderId, paymentId){
    try {
        let url = `${clover_paths[process.env.CLOVER_ENV].payment}/v1/orders/${orderId}/pay`;
        const post_data = { ecomind: "ecom", source: paymentId };

        let dataRet = await fetch(url, { 
            method: 'POST', body: post_data,
            headers: {
                "Content-Type":"application/json", 
                "Authentication": `Bearer ${authToken}`
            }
        });

        if(dataRet.status != 200) {
            log.error(`Paying Clover Order: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet };
    }
    catch(ex){
        log.error(`Paying Clover Order: ${ex}`);
        return { error: `Paying Clover Order: ${ex}` };
    }
}
