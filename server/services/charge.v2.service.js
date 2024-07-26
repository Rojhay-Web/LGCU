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
                const oauthTokenRes = await GetOAuthToken(request_code);
                if(oauthTokenRes.error) { throw oauthTokenRes.error; }

                // Store In Cache
                oauthToken = oauthTokenRes.results.access_token;
                store.updateCacheStore('clover_access_token', oauthToken, oauthTokenRes.results.access_token_expiration);
            }                    

            // Get Api Access Key (pakms)
            let apiKey = store.searchCacheStore('clover_api_key');
            if(!apiKey) {
                const apiKeyRes = await GetAPIKey(oauthToken);
                if(apiKeyRes.error) { throw apiKeyRes.error; }
                
                // Store In Cache
                apiKey = apiKeyRes.results.apiAccessKey;
                store.updateCacheStore('clover_api_key', apiKey, null);
            }

            // Create Card Token
            const cardToken = await CreateCardToken(apiKey, cardInfo);
            if(cardToken.error) { throw cardToken.error; }
                
            // Create Order
            const orderInfo = await CreateOrder(oauthToken, title, description, chargeItems);
            if(orderInfo.error) { throw orderInfo.error; }
                
            // Order Payment
            const orderPayStatus = await OrderPayment(oauthToken, orderInfo.results?.id, cardToken.results);
            if(orderPayStatus.error) { throw orderPayStatus.error; }
                
            // TODO: Send Charge Receipt
            if(studentId){
                // TODO: Add Transaction Info to User
            }

            return { results: orderPayStatus?.results?.status };
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

        let res = await fetch(url, { 
            method: 'POST', body: JSON.stringify(post_data),
            headers: { 
                "Accept":"application/json",
                "Content-Type":"application/json",
            }
        });
        let dataRet = await res.json();
        
        if(res.status != 200) {
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

        let res = await fetch(url, { 
            method: 'GET',
            headers: {
                "Content-Type":"application/json", 
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        let dataRet = await res.json();

        if(res.status != 200) {
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
            "card":{
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
            }
        };

        let res = await fetch(url, { 
            method: 'POST', body: JSON.stringify(post_data),
            headers: {
                "Content-Type":"application/json", "apikey": apiKey
            }
        });

        let dataRet = await res.json();

        if(res.status != 200) {
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
        const line_items = validateCharges(chargeItems);
        if(line_items.error) { throw 'Validating Charge(s)'; }

        // TODO: GET Order Type
        const order_type_id = process.env.CLOVER_ORDER_TYPE;

        let url = `${clover_paths[process.env.CLOVER_ENV].base}/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/atomic_order/orders`;
        const post_data = {
            orderCart:{
                title: title, note: description, 
                lineItems: line_items.results, 
                orderType: { id: order_type_id },
                currency:"USD"
            }
        };

        let res = await fetch(url, { 
            method: 'POST', body: JSON.stringify(post_data),
            headers: {
                "Content-Type":"application/json", 
                "Authorization": `Bearer ${authToken}`
            }
        });
        let dataRet = await res.json();

        if(res.status != 200) {
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

async function OrderPayment(authToken, orderId, paymentId){
    try {
        if(!orderId ){
            log.error(`Error Validting Order Id For Payment`);
            return {"error": "Paying Clover Order [E00]"};
        }
        else if(!paymentId){
            log.error(`Error Validting Payment ID For Payment`);
            return {"error": "Paying Clover Order [E01]"}
        }

        let url = `${clover_paths[process.env.CLOVER_ENV].payment}/v1/orders/${orderId}/pay`;
        const post_data = { ecomind: "ecom", source: paymentId };

        let res = await fetch(url, { 
            method: 'POST', body: JSON.stringify(post_data),
            headers: {
                "Content-Type":"application/json", 
                "Authorization": `Bearer ${authToken}`
            }
        });
        let dataRet = await res.json();

        if(res.status != 200) {
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


function validateCharges(chargeItems){
    try {
        let ret = [];

        chargeItems.forEach((item)=>{
            if(item?.name?.length > 0 && item?.price >=0){
                let priceInCt = parseInt(item.price * 100);
                ret.push({
                    name: item.name, price: priceInCt,
                    priceWithModifiers: priceInCt,
                    printed: false, exchanged: false, isRevenue: true
                });
            }
        });

        return { results: ret };
    }
    catch(ex){
        log.error(`Validating Charge Items: ${ex}`);
        return { error: `Validating Charge Items: ${ex}` };
    }
}