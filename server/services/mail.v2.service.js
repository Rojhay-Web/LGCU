const nodemailer = require('nodemailer');

require('dotenv').config();
const log = require('./log.service');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_TOKEN,
    }
});

module.exports = {
    sendEmail: async function(subject, content, additionalData=null, toEmail='lenkeson8@gmail.com'){
        try {
            let emailText, emailHtml = buildEmailBody(content, additionalData);
            
            if(!subject){
                log.warning("Subject so email send was canceled");
                return { email_status:false };
            }

            const mailDetails = {
                from: `Lenkeson Global Christian University Website <${process.env.EMAIL_ADDRESS}>`, // sender address
                to: toEmail, 
                subject: subject,
                text: emailText,
                html: emailHtml,
            }
            
            let info = await mailTransporter.sendMail(mailDetails);
            log.info(`Email Sent: ${info.messageId}`);
            return { email_status: true };
        }
        catch(ex){
            log.error(`Sending Email: ${ex}`);
            return { error: `Sending Email: ${ex}`, email_status: false };
        }
    },
    sendEmailAttachment: async function(toEmail, subject, content, files){
        try {
            let emailText, emailHtml = buildEmailBody(content);
            
            if(!toEmail || !subject){
                log.warning("Missing toEmail or subject so email send was canceled");
                return { "email_status":false };
            }

            let file_list = Array.isArray(files) ? files :  [files];

            let attachment_list = file_list.map((file) => {
                return { filename: file.name, content: file.data }; 
            });

            const mailDetails = {
                from: `St. Elizabeth HSA Website <${process.env.EMAIL_ADDRESS}>`, // sender address
                to: toEmail, 
                subject: subject,
                text: emailText,
                html: emailHtml,
                attachments: attachment_list
            }
            
            let info = await mailTransporter.sendMail(mailDetails);
            log.info(`Email Sent: ${info.messageId}`);
            return { email_status: true };
        }
        catch(ex){
            log.error(`Sending Email: ${ex}`);
            return { error: `Sending Email: ${ex}`, email_status: false };
        }
    },
    sendAppEmail: async function(req,res){ 
            var response = {"errorMessage":null, "results":null};
    
            try {
                let emailInfo = req.body;
    
                let appID = (emailInfo.appId ? emailInfo.appId : generateAppId(emailInfo.formData));
    
                let defaultEmail = `lenkeson8@gmail.com`;

                const mailDetails = {
                    from: `Lenkeson Global Christian University Website <${process.env.EMAIL_ADDRESS}>`, // sender address
                    to: defaultEmail, 
                    subject: emailInfo.subject + " " + Date.now(),
                    text: '', html: buildAppEmailHtml(emailInfo, appID),
                };

                let info = await mailTransporter.sendMail(mailDetails);
                log.info(`Email Sent: ${info.messageId}`);

                res.status(200).json({ email_status: true });
            }
            catch(ex){
                response.errorMessage = "[Error]: Error sending application email: "+ ex;
                console.log(response.errorMessage);
                res.status(200).json(response);
            }
        }
}

/* Private Functions */
function buildEmailBody(content, additionalData=null){
    let text = "", html ="";
    try {
        content.forEach((item) =>{
            text += ` ${item}`;
            html += `<p>${item}</p>`;
        });

        if(additionalData) {
            let additionalList = Object.keys(additionalData);
        
            ret +=  '<h2>Additional Data:</h2>';
            additionalList.forEach(function(item){
                ret += util.format('<p><b>%s:</b> <span>%s</span></p>', item, additionalData[item]);
            }); 
        }
    }
    catch(ex){
        log.error(`Building Email Body: ${ex}`);
    }

    return text, html;
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