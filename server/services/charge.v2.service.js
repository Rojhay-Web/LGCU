require('dotenv').config();

const { MongoClient, ObjectId } = require('mongodb');
const log = require('./log.service'),
    fns = require('date-fns');

const client = new MongoClient(process.env.DatabaseConnectionString);
(async () => { await client.connect(); log.debug(`Connected Successfully to db server`); })();

const clover_paths = {
    "dev":{
        "base":"https://sandbox.dev.clover.com",
        "oauth":"https://apisandbox.dev.clover.com",
        "payment":"https://scl-sandbox.dev.clover.com",
        "token":"https://token-sandbox.dev.clover.com",
        // "redirect":"http://localhost:2323/v2/api/oauth-store",
        "redirect":"http://localhost:2323/payment-portal",
        "redirectUrls":{
            "success":"https://lgcu-local.loca.lt/v2/api/lgcu-cart/success",
            "failure":"https://lgcu-local.loca.lt/v2/api/lgcu-cart/failure",
            "cancel": "https://lgcu-local.loca.lt/v2/api/lgcu-cart/cancel"
        },
    },
    "prod":{
        "base":"https://www.clover.com", 
        "oauth":"https://api.clover.com", 
        "payment":"https://scl.clover.com", 
        "token":"https://token.clover.com", 
        "redirect":"https://www.lenkesongcu.org/v2/api/oauth-store",
        "redirectUrls":{
            "success":"https://www.lenkesongcu.org/v2/api/lgcu-cart/success",
            "failure":"https://www.lenkesongcu.org/v2/api/lgcu-cart/failure",
            "cancel": "https://www.lenkesongcu.org/v2/api/lgcu-cart/cancel"
        },
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
    chargeCart: async function(store, request_code, email, chargeItems, studentId=null){
        try {
            // Validations
            if(request_code.length <= 0){
                return { error: 'Invalid Request Code' };
            }

            // Get Oauth Token
            let oauthToken = store.searchCacheStore('clover_access_token');
            if(!oauthToken) {
                const oauthTokenRes = await GetOAuthToken(request_code);
                if(oauthTokenRes.error) { throw oauthTokenRes.error; }

                // Store In Cache
                oauthToken = oauthTokenRes.results.access_token;

                let expire_dt = fns.addMilliseconds(new Date(), oauthTokenRes.results.access_token_expiration);
                store.updateCacheStore('clover_access_token', oauthToken, expire_dt);
            }                    

            // Get Customer ID
            const customerIdRes = await GetCustomerId(oauthToken, email, studentId);
            let customerId = customerIdRes?.results ? customerIdRes.results : null;
            
            // Create Checkout Order
            const checkoutInfo = await CreateCheckout(oauthToken, email, chargeItems, studentId, customerId);
            if(checkoutInfo.error) { throw checkoutInfo.error; }            

            return checkoutInfo;
        }
        catch(ex){
            log.error(`Charging Card: ${ex}`);
            return { error: `Charging Card: ${ex}` };
        }
    },
    charge: async function(store, request_code, cardInfo, title, description, chargeItems, studentId=null){
        try {
            // Validations
            const cardValidations = validateCard(cardInfo);
            if(cardValidations.length > 0){
                return { error: `${cardValidations.join(', ')}` };
            }
            else if(request_code.length <= 0){
                return { error: 'Invalid Request Code' };
            }

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
                const transactionInfo = {
                    userId: new ObjectId(studentId),
                    status: orderPayStatus?.results?.status,
                    chargeItems: chargeItems
                };
                const collection = await dbCollection("mylgcu_charges");
                // const charge_ret = collection.insertOne(transactionInfo);
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
        
        const HR_MS = 3600 * 1000;
        const default_expire = dataRet.access_token_expiration ? dataRet.access_token_expiration - HR_MS : HR_MS;
        const offset_expire = fns.addDays(new Date(), 2);

        dataRet.access_token_expiration = offset_expire.getTime() < default_expire ? offset_expire.getTime() : default_expire;
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

async function CreateCheckout(authToken, userEmail, chargeItems, studentId, customerId){
    try {
        const line_items = validateCheckoutCharges(chargeItems);
        if(line_items.error) { throw 'Validating Charge(s)'; }

        let url = `${clover_paths[process.env.CLOVER_ENV].base}/invoicingcheckoutservice/v1/checkouts`;
        const post_data = {
            customer: {
                ...(customerId ? { id: customerId } : {}),
                ...(studentId ? { lastName: studentId } : {}),
                email: userEmail
            },
            redirectUrls: clover_paths[process.env.CLOVER_ENV].redirectUrls,
            shoppingCart:{
                total: line_items.total, subtotal: line_items.total,
                lineItems: line_items.results
            }
        };

        let res = await fetch(url, { 
            method: 'POST', body: JSON.stringify(post_data),
            headers: {
                "X-Clover-Merchant-Id":`${process.env.CLOVER_MERCHANT_ID}`,
                "accept":"application/json", 
                "content-type":"application/json", 
                "Authorization": `Bearer ${authToken}`
            }
        });
        let dataRet = await res.json();

        if(res.status != 200) {
            log.error(`Creating Clover Checkout Order: ${dataRet.message}`);
            return { error: dataRet.message };
        }
        
        return { results: dataRet };
    }
    catch(ex){
        log.error(`Creating Clover Order: ${ex}`);
        return { error: `Creating Clover Order: ${ex}` };
    }
}

async function GetCustomerId(authToken, email, studentId){
    try {

        let query = (studentId ? `lastName%20LIKE%20${studentId}`:`emailAddress%20LIKE%20${email}`);

        let url = `${clover_paths[process.env.CLOVER_ENV].base}/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/customers`;
        let queryUrl = `${url}?expand=emailAddresses%2Cmetadata&filter=${query}`;
        
        let res = await fetch(queryUrl, { 
            method: 'GET',
            headers: {
                "accept":"application/json", 
                "content-type":"application/json", 
                "Authorization": `Bearer ${authToken}`
            }
        });
        let dataRet = await res.json();

        if(res.status != 200) {
            log.error(`Getting Clover Customer List: ${dataRet.message}`);
            return { error: dataRet.message };
        }

        let retId = (dataRet?.elements?.length > 0 ? dataRet.elements[0].id : null);

        return { results: retId };
    }
    catch(ex){
        log.error(`Getting Clover Customer List: ${ex}`);
        return { error: `Getting Clover Customer List: ${ex}` };
    }
}

async function dbCollection(conn_collection) {
    let collection = null;
    try {
        if(client?.s?.hasBeenClosed){
            await client.connect();
            log.debug(`Connected Successfully [Reconnected] to db server`);
        }
        
        const db = client.db(process.env.DatabaseName);
        collection = db.collection(conn_collection);
    }
    catch(ex){
        log.error(`Connection to Database: ${ex}`);
    }

    return collection;
}

/* Validations */
function validateCheckoutCharges(chargeItems){
    try {
        let ret = [], total = 0;

        chargeItems.forEach((item)=>{
            if(item?.name?.length > 0 && item?.price >=0){
                let priceInCt = parseInt(item.price * 100);
                ret.push({
                    name: item.name, price: priceInCt,
                    note:"", unitQty: 1
                });
                total += priceInCt;
            }
        });

        return { results: ret, total: total };
    }
    catch(ex){
        log.error(`Validating Checkout Charge Items: ${ex}`);
        return { error: `Validating Checkout Charge Items: ${ex}` };
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

function validateCard(cardInfo){
    let ret = [];
    try {
        // Card Number
        if(cardInfo.number?.length < 15){
            ret.push(`Invalid Card Number`);
        }

        // Card Exp Date
        if(cardInfo.exp_month?.length < 2 || cardInfo.exp_year?.length < 4 || !fns.isDate(fns.parseISO(`${cardInfo.exp_year}-${cardInfo.exp_month}-01`))){
            ret.push(`Invalid Expiration Date`);
        }

        // Card CVV
        if(cardInfo.cvv?.length < 3){
            ret.push(`Invalid CVV Number`);
        }

        // Card country
        if(cardInfo.country?.length <= 0){
            ret.push(`Invalid Country`);
        }

        // Card brand
        if(cardInfo.brand?.length <= 0){
            ret.push(`Invalid Card Brand`);
        }

        // Card Cardholder name
        if(cardInfo.name?.length <= 0){
            ret.push(`Invalid Card Holder Name`);
        }

        // Card Cardholder address
        if(cardInfo.address?.length <= 0){
            ret.push(`Invalid Card Holder Address`);
        }

        // Card Cardholder city
        if(cardInfo.city?.length <= 0){
            ret.push(`Invalid Card Holder City`);
        }

        // Card Cardholder state
        if(cardInfo.state?.length <= 0){
            ret.push(`Invalid Card Holder State`);
        }

        // Card Cardholder zip
        if(cardInfo.zip?.length <= 0){
            ret.push(`Invalid Card Holder Zip`);
        }
    }
    catch(ex){
        log.error(`Validating Card: ${ex}`);
        ret.push(`Error Code [00X]`);
    }
    return ret;
}