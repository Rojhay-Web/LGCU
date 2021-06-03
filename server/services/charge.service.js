require('dotenv').config();
const nodemailer = require("nodemailer");

const payeezy = require('./payeezy_update/payeezy')(process.env.PAYEEZY_API, process.env.PAYEEZY_SECRET, process.env.PAYEEZY_MERCHANT_TOKEN);
payeezy.version = "v1";
payeezy.host = process.env.PAYEEZY_BASE;

const util = require('util');

var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var charge = {
    applicationCharge:function(chargeInfo, callback){ 
        var response = {"errorMessage":null, "results":null};
        var defaultEmail = "admin@lenkesongcu.org";

        /* { userEmail:str, appId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:{name, description, quantity, price}} */

        try {
            
            chargeCard(chargeInfo.cardInfo, chargeInfo.chargeDescription, chargeInfo.chargeItems, null,
                function(ret){
                    if(ret.errorMessage){
                        // Unsuccessfully Charge
                       console.log("Unsuccessful Charge");
                       console.log(ret.errorMessage);
                    }
                    else if(ret.results.transaction_status != "approved"){
                        ret.errorMessage = "Transaction Not Approved";
                        console.log("Unsuccessful Charge");
                        console.log(ret.results);
                    }
                    else {
                        // Successful Charge
                        // Send Email to Default
                        sendChargeEmail(defaultEmail, chargeInfo, ret.results, function(ret){ });
                        // Send Email Receipt to User
                        sendChargeEmail(chargeInfo.userEmail, chargeInfo, ret.results, function(ret){ });
                        // Add Transaction ID to User DB
                    }
                    
                    callback(ret);
                });    
        }
        catch(ex){
            response.errorMessage = "[Error] application charge: "+ ex;
            console.log(response.errorMessage);
            callback(response);
        }
    },
    accountCharge(accountInfo, chargeInfo, callback){
        var response = {"errorMessage":null, "results":null};
        var defaultEmail = "admin@lenkesongcu.org";

        /* { userEmail:str, studentId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:{name, description, quantity, price}} */

        try {

            chargeCard(chargeInfo.cardInfo, chargeInfo.chargeDescription, 
                chargeInfo.chargeItems, accountInfo.studentId,
                function(ret){
                    if(ret.errorMessage){
                        // Unsuccessfully Charge
                       console.log("Unsuccessful Charge");
                       console.log(ret.errorMessage);
                       callback(ret);
                    }
                    else if(ret.results.transaction_status != "approved"){
                        ret.errorMessage = "Transaction Not Approved";
                        console.log("Unsuccessful Charge");
                        console.log(ret.results);
                        callback(ret);
                    }
                    else {
                        // Successful Charge
                        // Send Email to Default
                        sendChargeEmail(defaultEmail, chargeInfo, ret.results, function(emailRet){ });
                        // Send Email Receipt to User
                        sendChargeEmail(chargeInfo.userEmail, chargeInfo, ret.results, function(emailRet2){ });

                        // Add Transaction Info to User
                        response.results = shortenTransactionInfo(ret.results);
                        addTransactionToUser(accountInfo, response.results, function(addRet) {
                            callback(response);
                        });
                    }                  
                });   
        }
        catch(ex){
            response.errorMessage = "[Error] account charge: "+ ex;
            callback(response);
        }
    },
    getUserTransactions: function(user, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            if(!user || !user._id) {
                response.errorMessage = "No Valid User";
                callback(response);
            }
            else {
                getTransactionsByUser(user._id,function(ret){ 
                    callback(ret);
                });
            }
        }
        catch(ex){
            response.errorMessage = "[Error] Getting User Account Transactions (E09): "+ex;
            callback(response);
        }
    }
}

module.exports = charge;

function shortenTransactionInfo(transInfo){
    var ret = {};
    try {
        ret = {
            "transaction_id": transInfo.transaction_id,
            "transaction_status": transInfo.transaction_status,
            "transaction_date": Date.now(), "method": transInfo.method,
            "amount": transInfo.amount,  "card": transInfo.card            
        }
    }
    catch(ex){
        console.log("[Error] Shortening Transaction Info: "+ ex);
        ret = transInfo;
    }
    return ret;
}

function chargeCard(cardInfo, chargeDesc, chargeItems, studentId, callback){
    var response = {"errorMessage":null, "results":null};

    try {
        var invoceNum = "lgcu"+ (studentId ? "."+studentId+"." : "-") + Date.now();
        var chargeAmt = chargeItems.amount.toString().split(".").join("");
        
        var postData = {
            "merchant_ref": invoceNum + " Description: " + chargeDesc, 
            "amount": chargeAmt, 
            "partial_redemption": "false", "transaction_type": "purchase", 
            "method": "credit_card", "currency_code": "USD",
            "credit_card": {
                "type": cardInfo.type, "cardholder_name": cardInfo.name,
                "card_number": cardInfo.cardNumber, "exp_date": cardInfo.cardExp, "cvv": cardInfo.cvv
            }
        };
        
       payeezy.transaction.purchase(postData, function(error, res){
            if (error) {
                response.errorMessage = "[Error] charging card (L2)";
                response.results = error;
            }
            else if(!res){
                response.errorMessage = "[Error] charging card (L3): No Response";
            }
            else {
                response.results = res;
            }

            callback(response);
       });
    }
    catch(ex){
        response.errorMessage = "[Error] charging card: "+ ex;
        console.log(response.errorMessage);
        callback(response);
    }
}


function buildChargeEmailHtml(chargeInfo, transactionInfo){
    var ret = "";
    try {
        /* { userEmail:str, studentId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:{name, description, quantity, price}} */

        ret +=  util.format('<h1>%s</h1>', chargeInfo.chargeDescription);
        ret +=  '<table border="1" style="border-color:rgba(80, 78, 153,0.5)"><tr><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Description</th><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Info</th><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;"></th></tr>';
        
        ret += util.format('<tr><td>Name</td><td colspan="2">%s</td></tr>', chargeInfo.cardInfo.name.toString());
        if(chargeInfo.appId) { ret += util.format('<tr><td>Application Id</td><td>%s</td></tr>', chargeInfo.appId.toString()); }
        
        // Charges
        ret += util.format('<tr><td colspan="3" style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Charge Info</td></tr>');
        
        ret += util.format('<tr><td>%s</td><td>%s</td><td>$ %s</td></tr>', chargeInfo.chargeItems.name, chargeInfo.chargeItems.description, chargeInfo.chargeItems.amount.toString());
        
        // Charge Info
        ret += util.format('<tr><td colspan="3" style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Transaction Info</td></tr>');
        ret += util.format('<tr><td>Transaction ID</td><td colspan="2">%s</td></tr>', transactionInfo.transaction_id);
        
        ret += util.format('<tr><td>Card Holder Name</td><td colspan="2">%s</td></tr>', transactionInfo.card.cardholder_name.toString());
        ret += util.format('<tr><td>Card</td><td colspan="2">%s</td></tr>', transactionInfo.card.card_number.toString());
        
        ret +=  '</table>';
    }
    catch(ex){
        console.log("[Error] Error building charge email html: ",ex);        
    }

    return ret;
}

function sendChargeEmail(sendEmail, chargeInfo, transactionInfo, callback){ 
    var response = {"errorMessage":null, "results":null};
    try {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_SERVER_USER,
                clientId: process.env.MAIL_SERVER_CLIENTID,
                clientSecret: process.env.MAIL_SERVER_CLIENT_SECRET,
                refreshToken: process.env.MAIL_SERVER_REFRESH_TOKEN,
                accessToken: process.env.MAIL_SERVER_ACCESS_TOKEN
            }
          });

          var mailOptions = {
            from: process.env.user,
            to: sendEmail,
            subject: "Lenkeson Global Christian University Transaction - Receipt",
            html: buildChargeEmailHtml(chargeInfo, transactionInfo)
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                response.errorMessage = error;
            } else {
                response.results = 'Email Sent';                  
            }    
            callback(response);            
          });
    }
    catch(ex){
        response.errorMessage = "[Error] sending charge email: "+ ex;
        console.log(response.errorMessage);
        callback(response);
    }
}

function getTransactionsByUser(userId, callback){
    var response = { "errorMessage":null, "results":null };

    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_charges'); 

                db.find({ 'userId': ObjectId(userId) }).toArray(function(err, res){ 
                    if(err){
                        response.errorMessage = err;
                    }
                    else {
                        response.results = res;
                    }

                    client.close();
                    callback(response);
                });
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] Getting User Transactions: "+ ex;
        console.log(response.errorMessage);
        callback(response);
    }
}

function addTransactionToUser(userInfo, transactionInfo, callback){
    var response = {"errorMessage":null, "results":null};

    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_charges'); 

                transactionInfo.userId = ObjectId(userInfo._id);
                transactionInfo.type = "payment";
                
                // Insert User Transaction
                db.insertOne(transactionInfo, function(insertError,retObj){
                    if(insertError){
                        response.error = insertError;
                    }
                    else {                    
                        response.results = (retObj.ops.length > 0);                                                                                
                    }
                    
                    client.close();                            
                    callback(response);
                });
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] adding user transaction (E09): "+ ex;
        console.log(response);
        callback(response);
    }
}