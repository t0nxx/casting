"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailgun = require('mailgun-js');
const DOMAIN = 'castingsecret.com';
const mg = mailgun({ apiKey: '13c992e774b054f494bbd805381e4816-f696beb4-b9c906c7', domain: DOMAIN, host: "api.eu.mailgun.net" });
function sendMail(mail, resetCode) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Reset Password Code',
        text: ` Hi , 
        Your code is ${resetCode} .`
    };
    mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map