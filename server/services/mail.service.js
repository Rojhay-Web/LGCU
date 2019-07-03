const nodemailer = require("nodemailer");
var util = require('util');

var mail = {
    sendEmail:function(req,res){ 
        var response = {"errorMessage":null, "results":null};

        // {}
        try {
            var emailInfo = req.body.emailInfo;

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'youremail@gmail.com',
                  pass: 'yourpassword'
                }
              });

              var mailOptions = {
                from: 'youremail@gmail.com',
                to: emailInfo.email,
                subject: emailInfo.subject,
                html: buildEmailHtml(emailInfo)
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    throw error;
                } else {
                    response.results = 'Email sent: ' + info.response;                  
                    res.status(200).json(response);
                }                
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