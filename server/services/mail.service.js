const nodemailer = require("nodemailer");
var util = require('util');

var mail = {
    sendEmail:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        /* { email: "", subject:"", title:"", formdata:{}, additionalData:{}} */

        try {
            var emailInfo = req.body.emailInfo;

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: 'web.lgcu@gmail.com',
                    clientId: '90291297521-r8hub9fkpt532s5s0lg24d96j7139l9a.apps.googleusercontent.com',
                    clientSecret: 'dAEipnU6I-oPeC5u5Cm1qCr0',
                    refreshToken: '1/oB315e-1qDWJZC6Nb1y2DK39o9fmNRguK7jzescqXvE',
                    accessToken: 'ya29.Gls6B3Ybj9YexL9Wvx6zrRXgU8skf4NdOuNOpBVvrYUrIrO59uSGCbhkK0w81c3ftpxpE5VvlEdX3RALB0xm5c3qh3xBuziGHxan0uDgmQO8vW6kUWTAmL_JkmYA'
                }
              });

              var mailOptions = {
                from: 'web.lgcu@gmail.com',
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
            ret += util.format('<p><b>%s:</b> <span>%s</span></p>', item, obj.formData[item]);
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