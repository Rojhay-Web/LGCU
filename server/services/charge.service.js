require('dotenv').config();
const nodemailer = require("nodemailer");

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
const util = require('util');

var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

var charge = {
    applicationCharge:function(req,res){ 
        var response = {"errorMessage":null, "results":null};
        var defaultEmail = "admin@lenkesongcu.org";

        /* { userEmail:str, appId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:[{name, description, quantity, price}]} */

        try {
            var transactionInfo = req.body;

            chargeCard(transactionInfo.cardInfo, transactionInfo.chargeDescription, 
                transactionInfo.chargeItems, transactionInfo.userEmail, null,
                function(ret){
                    if(ret.status >= 0){
                        // Successful Charge
                        // Send Email to Default
                        sendChargeEmail(defaultEmail, transactionInfo, ret.results, function(ret){ });
                        // Send Email Receipt to User
                        sendChargeEmail(transactionInfo.userEmail, transactionInfo, ret.results, function(ret){ });
                        // Add Transaction ID to User DB
                    }
                    else {
                        // Unsuccessfully Charge
                        response.errorMessage = "Unsuccessful Charge"
                    }

                    response.results = ret.results;
                    res.status(200).json(response);
                });    
        }
        catch(ex){
            response.errorMessage = "[Error]: Error application charge: "+ ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    },
    accountCharge(accountInfo, transactionInfo, callback){
        var response = {"errorMessage":null, "results":null};
        var defaultEmail = "admin@lenkesongcu.org";

        /* { userEmail:str, studentId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:[{name, description, quantity, price}]} */

        try {
            chargeCard(transactionInfo.cardInfo, transactionInfo.chargeDescription, 
                transactionInfo.chargeItems, transactionInfo.userEmail, accountInfo.studentId,
                function(ret){
                    if(ret.status >= 0){
                        // Successful Charge
                        // Send Email to Default
                        sendChargeEmail(defaultEmail, transactionInfo, ret.results, function(ret){ });
                        // Send Email Receipt to User
                        sendChargeEmail(transactionInfo.userEmail, transactionInfo, ret.results, function(ret){ });

                        // Add Transaction Info to User
                        addTransactionToUser(accountInfo, ret.results, function(ret){ });
                    }
                    else {
                        // Unsuccessfully Charge
                        response.errorMessage = "Unsuccessful Charge"
                    }

                    response.results = ret.results;
                    callback(response);
                });   
        }
        catch(ex){
            response.errorMessage = "[Error]: Error account charge: "+ ex;
            callback(response);
        }
    },
    createAccount: function(accountInfo, callback){
        var response = {"errorMessage":null, "results":null};
        /* { fullname, email, userId }*/

        try {     
            var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
            merchantAuthenticationType.setName(process.env.AuthNetApiLoginKey);
            merchantAuthenticationType.setTransactionKey(process.env.AuthNetTransactionKey);

            var customerProfileType = new ApiContracts.CustomerProfileType();
            customerProfileType.setMerchantCustomerId('AN_' + accountInfo.studentId);
            customerProfileType.setDescription(accountInfo.fullname);
            customerProfileType.setEmail(accountInfo.email);

            var createRequest = new ApiContracts.CreateCustomerProfileRequest();
            createRequest.setProfile(customerProfileType);
            createRequest.setMerchantAuthentication(merchantAuthenticationType);

            var ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());

            ctrl.execute(function(){
                var apiResponse = ctrl.getResponse();

                var ret = new ApiContracts.CreateCustomerProfileResponse(apiResponse);
                if(ret != null) {
                    if(ret.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                        addAuthNETUserInfo(accountInfo, ret.getCustomerProfileId(), function(autret){ callback(autret); });                        
                    }
                    else {
                        response.errorMessage = "[Error] Creating Authorize.NET User Profile (E08): " + ret.getMessages().getMessage()[0].getText();
                        callback(response);
                    }
                }
                else {
                    response.errorMessage = "[Error] Creating Authorize.NET User Profile (E07)";
                    callback(response);
                }                
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Creating Authorize.NET User Profile (E09): "+ex;
            callback(response);
        }
    },
    searchUserTransactions: function(transList, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            var retList = [];
            if(!transList) {
                response.results = [];
                callback(response);
            }
            else {
                transList.forEach(function(transactionId){
                    searchTransactionById(transactionId, function(ret){
                        retList.push(ret);

                        if(retList.length == transList.length){
                            response.results = retList;
                            callback(response);
                        }
                    });
                });
            }
        }
        catch(ex){
            response.errorMessage = "[Error] Searching Account Transactions (E09): "+ex;
            callback(response);
        }
    },
    searchAccountTransactions: function(searchInfo, callback){
        var response = {"errorMessage":null, "results":null};

        /* pageInfo: {limit, offset, accountId} */
        try {
            var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
            merchantAuthenticationType.setName(process.env.AuthNetApiLoginKey);
            merchantAuthenticationType.setTransactionKey(process.env.AuthNetTransactionKey);

            var paging = new ApiContracts.Paging();
            paging.setLimit(searchInfo.limit);
            paging.setOffset(searchInfo.offset);

            var sorting = new ApiContracts.TransactionListSorting();
            sorting.setOrderBy(ApiContracts.TransactionListOrderFieldEnum.ID);
            sorting.setOrderDescending(true);

            var getRequest = new ApiContracts.GetTransactionListForCustomerRequest();
            getRequest.setMerchantAuthentication(merchantAuthenticationType);
            getRequest.setCustomerProfileId(searchInfo.accountId);
            getRequest.setPaging(paging);
            getRequest.setSorting(sorting);

            var ctrl = new ApiControllers.GetTransactionListForCustomerController(getRequest.getJSON());
            
            ctrl.execute(function(){ 
                var apiResponse = ctrl.getResponse();

                var ret = new ApiContracts.GetTransactionListResponse(apiResponse);
                
                if(ret != null) {
                    if(ret.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                        response.results = [];
                        var transactions = ret.getTransactions().getTransaction();

                        transactions.forEach(function(trans){
                            response.results.push({
                                    id: trans.getTransId(), status:trans.getTransactionStatus(), 
                                    accountType:trans.getAccountType(), settleAmmount:trans.getSettleAmount(),
                                    date:trans.submitTimeLocal
                                });
                        });
                    }
                    else {
                        response.errorMessage = "[Error] Searching Account Transactions (E08): " + ret.getMessages().getMessage()[0].getText();
                    }
                }
                else {
                    response.errorMessage = "[Error] Searching Account Transactions (E07)";
                }

                callback(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Searching Account Transactions (E09): "+ex;
            callback(response);
        }
    }
}

module.exports = charge;


function chargeCard(cardInfo, chargeDesc, chargeItems, userEmail, studentId, callback){
    var ret = {"errorMessage":null, "status":null, "results":null};

    try {
        var transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);

        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.AuthNetApiLoginKey);
        merchantAuthenticationType.setTransactionKey(process.env.AuthNetTransactionKey);
        
        /* Credit Card */
        var creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(cardInfo.cardNumber);
        creditCard.setExpirationDate(cardInfo.cardExp);
        creditCard.setCardCode(cardInfo.cardCode);
        var paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);
        transactionRequestType.setPayment(paymentType);

        /* Billing User */
        var billTo = new ApiContracts.CustomerAddressType();
        billTo.setFirstName(cardInfo.firstname);
        billTo.setLastName(cardInfo.lastname);
        billTo.setZip(cardInfo.zip);
        billTo.setCountry(cardInfo.countryCode);
        billTo.setEmail(userEmail);
        transactionRequestType.setBillTo(billTo);

        /* Order Details */
        var orderDetails = new ApiContracts.OrderType();
        var invoceNum = "lgcu"+ (studentId ? "."+studentId+"." : "-") + Date.now();
	    orderDetails.setInvoiceNumber(invoceNum);
        orderDetails.setDescription(chargeDesc);
        transactionRequestType.setOrder(orderDetails);

        /* Line Item */
        var lineItemList = [];
        var total = 0.00;
        for(var i =0; i < chargeItems.length; i++){
            var tmpeLineItem = new ApiContracts.LineItemType();
            tmpeLineItem.setItemId(i);
            tmpeLineItem.setName(chargeItems[i].name);
            tmpeLineItem.setDescription(chargeItems[i].description);
            tmpeLineItem.setQuantity(chargeItems[i].quantity);
            tmpeLineItem.setUnitPrice(chargeItems[i].price);

            if(parseFloat(chargeItems[i].price) != "NaN"){
                total = total + parseFloat(chargeItems[i].price);
            }
            lineItemList.push(tmpeLineItem);
        }
        /* Line Item Total */
        var lineItems = new ApiContracts.ArrayOfLineItem();
        lineItems.setLineItem(lineItemList);
        transactionRequestType.setLineItems(lineItems);
        transactionRequestType.setAmount(total.toFixed(2));

        /* Transaction */
        var createRequest = new ApiContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);

        //pretty print request
        if(process.env.CODEENV && process.env.CODEENV == "DEBUG") { 
            console.log("transaction sent");
            console.log(JSON.stringify(createRequest.getJSON(), null, 2));
        }

        var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
        
        //Defaults to sandbox
        if(!(process.env.CODEENV && process.env.CODEENV == "DEBUG")) { 
            ctrl.setEnvironment(SDKConstants.endpoint.production);
        }
        
        /* Send Transaction */
        ctrl.execute(function(){ 
            var apiResponse = ctrl.getResponse();
            var response = new ApiContracts.CreateTransactionResponse(apiResponse);
            
            //pretty print response
            if(process.env.CODEENV && process.env.CODEENV == "DEBUG") { 
                console.log("transaction completed");
                console.log(JSON.stringify(response, null, 2));
            }
            
            if(response != null){ 
                if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                    if(response.getTransactionResponse().getMessages() != null){
                        /* Successful Transaction */
                        ret.status = 0;
                    }
                    else {
                        /* Failed Transaction - E1 */
                        ret.errorMessage = "Failed Transaction [E1]";
                        ret.status = -1;
                    }
                }
                else {
                    /* Failed Transaction - E2 */
                    ret.errorMessage = "Failed Transaction [E2]";
                    ret.status = -2;
                    console.log(response);
                }
            }
            else {
                ret.errorMessage = "Invalid Response Please Contact Our Financial Aid Office";
                ret.status = -3;
            }

            ret.results = response;
            callback(ret);
        });
    }
    catch(ex){
        ret.errorMessage = "[Error]: Error charging card: "+ ex;
        console.log(ret.errorMessage);
        callback(ret);
    }
}


function buildChargeEmailHtml(chargeInfo, transactionInfo){
    var ret = "";
    try {
        /*{ userEmail:str, appId:str, chargeDescription:str, 
            cardInfo:{cardNumber, cardExp, cardCode, firstname, lastname, zip, country},
            chargeItems:[{name, description, quantity, price}]} */

        ret +=  util.format('<h1>%s</h1>', chargeInfo.chargeDescription);
        ret +=  '<table border="1" style="border-color:rgba(80, 78, 153,0.5)"><tr><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Description</th><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Info</th><th style="background-color:rgba(80, 78, 153,0.5); text-align:center;"></th></tr>';
        
        ret += util.format('<tr><td>First Name</td><td colspan="2">%s</td></tr>', chargeInfo.cardInfo.firstname.toString());
        ret += util.format('<tr><td>Last Name</td><td colspan="2">%s</td></tr>', chargeInfo.cardInfo.lastname.toString());
        if(chargeInfo.appId) { ret += util.format('<tr><td>Application Id</td><td>%s</td></tr>', chargeInfo.appId.toString()); }
        
        // Charges
        ret += util.format('<tr><td colspan="3" style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Charge Info</td></tr>');
        chargeInfo.chargeItems.forEach(function(item){
            ret += util.format('<tr><td>%s</td><td>%s</td><td>$ %s</td></tr>', item.name, item.description, item.price.toString());
        });
        
        // Charge Info
        ret += util.format('<tr><td colspan="3" style="background-color:rgba(80, 78, 153,0.5); text-align:center;">Transaction Info</td></tr>');
        ret += util.format('<tr><td>Transaction ID</td><td colspan="2">%s</td></tr>', transactionInfo.transactionResponse.transId);
        transactionInfo.transactionResponse.messages.message.forEach(function(item){
            ret += util.format('<tr><td>Code</td><td colspan="2">%s</td></tr>', item.code.toString());
            ret += util.format('<tr><td>Description</td><td colspan="2">%s</td></tr>', item.description.toString());
        });
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
        response.errorMessage = "[Error]: Error sending charge email: "+ ex;
        console.log(response.errorMessage);
        callback(response);
    }
}

function addAuthNETUserInfo(userInfo, authId, callback){
    var response = {"errorMessage":null, "results":null};

    try {
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                response.errorMessage = err;
                callback(response);
            }
            else {
                const db = client.db(database.dbName).collection('mylgcu_users'); 
                response.results = authId;

                db.updateOne({ "_id": ObjectId(userInfo._id) }, { $set: { accountId: authId }
                            }, {upsert: true, useNewUrlParser: true});
                
                client.close();
                callback(response);
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] adding users talentlms info to user (E09): "+ ex;
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
                const db = client.db(database.dbName).collection('mylgcu_users'); 

                db.updateOne({ "_id": ObjectId(userInfo._id) }, { $push: { authTrans: transactionInfo.transactionResponse.transId } 
                            }, {upsert: true, useNewUrlParser: true});
                
                client.close();
                callback(response);
            }
        });
    }
    catch(ex){
        response.errorMessage = "[Error] Updating user transaction (E09): "+ ex;
        console.log(response);
        callback(response);
    }
}

function searchTransactionById(transactionId, callback){
    var ret = {"errorMessage":null, "results":null};

    try {
        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.AuthNetApiLoginKey);
        merchantAuthenticationType.setTransactionKey(process.env.AuthNetTransactionKey);

        var getRequest = new ApiContracts.GetTransactionDetailsRequest();
        getRequest.setMerchantAuthentication(merchantAuthenticationType);
        getRequest.setTransId(transactionId);

        var ctrl = new ApiControllers.GetTransactionDetailsController(getRequest.getJSON());

        ctrl.execute(function(){

            var apiResponse = ctrl.getResponse();
    
            var response = new ApiContracts.GetTransactionDetailsResponse(apiResponse);

            if(response != null){
                if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                    ret.results = {
                        paymentStatus: response.transaction.responseReasonDescription,
                        transactionStatus: response.transaction.transactionStatus,
                        transactionId: response.transaction.transId,
                        order: response.transaction.order,
                        amount: response.transaction.settleAmount,
                        submitTime: response.transaction.submitTimeLocal,
                        lineItems: response.transaction.lineItems.lineItem.map(function(item){
                            return { id: item.itemId, name: item.name, description: item.description, quantity:item.quantity, price: item.unitPrice }
                        })
                    }
                }
                else{
                    ret.errorMessage = "[Error] Searching by id (E07)"
                }
            }
            else{
                ret.errorMessage = "[Error] Searching by id (E09)"
            }
            
            callback(ret);
        });
    }
    catch(ex){
        ret.errorMessage = "[Error] Searching transaction by id (E09): "+ ex;
        callback(ret);
    }
}