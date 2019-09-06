require('dotenv').config();
const nodemailer = require("nodemailer");

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
const util = require('util');

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
                transactionInfo.chargeItems, transactionInfo.userEmail,
                function(ret){
                    if(ret.status >= 0){
                        // Successful Charge
                        // Send Email to Default
                        sendChargeEmail(defaultEmail, transactionInfo, ret.results, function(ret){ });
                        // Send Email Receipt to User
                        sendChargeEmail(transactionInfo.userEmail, transactionInfo, ret.results, function(ret){ });
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
    }
}

module.exports = charge;


function chargeCard(cardInfo, chargeDesc, chargeItems, userEmail, callback){
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

        /* User Email */
        /*var emailTo = new ApiContracts.CustomerType();
        emailTo.setEmail(userEmail);
        transactionRequestType.setEmail(emailTo);*/

        /* Order Details */
        var orderDetails = new ApiContracts.OrderType();
        var invoceNum = "lgcu-"+Date.now();
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
        
        //Remove to defaults to sandbox
        if(!process.env.CODEENV || process.env.CODEENV !== "DEBUG") { 
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
        ret +=  '<table><tr><th>Description</th><th>Info</th></tr>';
        
        ret += util.format('<tr><td>First Name</td><td>%s</td></tr>', chargeInfo.cardInfo.firstname.toString());
        ret += util.format('<tr><td>Last Name</td><td>%s</td></tr>', chargeInfo.cardInfo.lastname.toString());
        ret += util.format('<tr><td>Application Id</td><td>%s</td></tr>', chargeInfo.appId.toString());
        ret += util.format('<tr><td>Charge Amount</td><td>$ %s</td></tr>', chargeInfo.chargeItems[0].price.toString());
        
        // Charge Info
        ret += util.format('<tr><td>Charge Info</td></tr>');
        transactionInfo.transactionResponse.messages.message.forEach(function(item){
            ret += util.format('<tr><td>Code</td><td>%s</td></tr>', item.code.toString());
            ret += util.format('<tr><td>Description</td><td>%s</td></tr>', item.description.toString());
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