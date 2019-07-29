require('dotenv').config();

const nodemailer = require("nodemailer");
const util = require('util');


var mail = {
    sendEmail:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        /* { email: "", subject:"", title:"", formdata:{}, additionalData:{}} */

        try {
            
            var emailInfo = req.body;

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
                to: emailInfo.email,
                subject: emailInfo.subject,
                html: buildEmailHtml(emailInfo)
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    response.errorMessage = error;
                } else {
                    response.results = 'Email Sent';                  
                }    
                res.status(200).json(response);            
              });
        }
        catch(ex){
            response.errorMessage = "[Error]: Error sending email: "+ ex;
            console.log(response.errorMessage);
            res.status(200).json(response);
        }
    }
}

function buildEmailHtml(obj){
    var ret = "";
    try {
        var dataList = Object.keys(obj.formData);
        
        ret +=  util.format('<h1>%s</h1>', obj.title);
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


module.exports = mail;