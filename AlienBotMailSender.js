'use strict';
function sendMailFromAlienBot(conversation){

    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            //Add your email username and password here
            user: 'pmiwatsondemo',
            pass: 'IBMwatson@5'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Watson IBM" <pmiwatsondemo@gmail.com>', // sender address
        to: 'aganguly@in.ibm.com', // list of receivers
        subject: 'Hello - This ia an automated mail from starterbot ✔', // Subject line
        text: conversation, // plain text body
        //html: `<b>${conversation}</b>` // html body
        html:''
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
module.exports.sendMailFromAlienBot = sendMailFromAlienBot;