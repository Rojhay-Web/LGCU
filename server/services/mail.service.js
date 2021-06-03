require('dotenv').config();

const util = require('util');

const mSettings = { 
    apikey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN,
    user: process.env.MAILGUN_SMTP_LOGIN,
    ccUser: process.env.MAIL_SERVER_USER
};

const mailgun = require('mailgun-js')({ apiKey: mSettings.apikey, domain: mSettings.domain });


var mail = {
    sendEmail:function(emailInfo,callback){ 
        var response = {"errorMessage":null, "results":null};

        /* { email: "", subject:"", title:"", formdata:{}, additionalData:{}} */

        try {
            var toUser = (emailInfo.email ? emailInfo.email+", "+ mSettings.ccUser : mSettings.ccUser);
            var mailOptions = {
                from: mSettings.user,
                to: emailInfo.email,
                subject: emailInfo.subject + " " + Date.now(),
                html: buildEmailHtml(emailInfo)
            };

            mailgun.messages().send(mailOptions, function (err, body) {
                if (err) {
                    console.log(" [Error] Sending Email: ", err);
                    response.errorMessage = err;
                }
                else {
                    response.results = 'Email Sent';
                }
                callback(response);
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error sending email: "+ ex;
            console.log(response.errorMessage);
            callback(response);
        }
    },
    sendAppEmail:function(req,res){ 
        var response = {"errorMessage":null, "results":null};
        /* { email: "", subject:"", title:"", formdata:{}} */

        try {
            var emailInfo = req.body;

            var appID = (emailInfo.appId ? emailInfo.appId : generateAppId(emailInfo.formData));
            var toUser = (emailInfo.email ? emailInfo.email+", "+ mSettings.ccUser : mSettings.ccUser);
            
            var mailOptions = {
                from: emailInfo.email,
                to: toUser,
                subject: emailInfo.subject + " " + Date.now(),
                html: buildAppEmailHtml(emailInfo, appID)
            };
            
            mailgun.messages().send(mailOptions, function (err, body) {
                if (err) {
                    console.log(" [Error] Sending App Email: ", err);
                    response.errorMessage = err;
                }
                else {
                    //console.log("Email Sent"); console.log(body);
                    response.results = { appId: appID, status: 'Email Sent' };
                }
                res.status(200).json(response); 
            });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error sending application email: "+ ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    }
}

function generateAppId(formdata) {
    var appId = "";

    try {
        var firstName = ("firstName" in formdata && formdata.firstName.value.length >= 1 ? formdata.firstName.value : "|");
        var lastName = ("lastName" in formdata && formdata.lastName.value.length >= 1  ? formdata.lastName.value : "!");

        appId = firstName.charAt(0) + lastName + "-"+ Date.now();
    }
    catch(ex){
        console.log("[Error]: Error generating app Id: ",ex);
        appId = "defaultID-000";
    }

    return appId;
}

function buildEmailHtml(obj, appID){
    var ret = "";
    try {
        var dataList = Object.keys(obj.formData);
        
        ret +=  util.format('<h1>%s</h1>', obj.title);
        ret +=  util.format('<p>Application ID: %s</p>', appID);
        dataList.forEach(function(item){
            ret += util.format('<p><b>%s:</b> <span>%s</span></p>', item, obj.formData[item].toString().replace(/\n/g,'<br>'));
        });

        if(obj.additionalData) {
            var additionalList = Object.keys(obj.additionalData);
        
            ret +=  '<h2>Additional Data:</h2>';
            additionalList.forEach(function(item){
                ret += util.format('<p><b>%s:</b> <span>%s</span></p>', item, obj.additionalData[item]);
            }); 
        }
    }
    catch(ex){
        console.log("[Error] Error building email html: ",ex);        
    }

    return ret;
}

function buildAppEmailHtml(obj, appID){
    var ret = "";
    try {
        var dataList = Object.keys(obj.formData);
        
        ret +=  util.format('<h1>%s</h1>', obj.title);
        ret +=  util.format('<h2>Application ID: %s</h2>', appID);
        ret +=  '<table><tr><th>Description</th><th>Info</th></tr>';

        dataList.forEach(function(item){
            ret += util.format('<tr><td>%s</td><td>%s</td></tr>', obj.formData[item].title, obj.formData[item].value.toString().replace(/\n/g,'<br>'));
        });

        ret +=  '</table>';
    }
    catch(ex){
        console.log("[Error] Error building application email html: ",ex);        
    }

    return ret;
}

module.exports = mail;