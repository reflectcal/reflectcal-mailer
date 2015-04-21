/*
 * Copyright (c) 2015. Epam, Alex K.
 */

/**
 * @fileoverview Core for mailer daemon.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { createTransport } from 'nodemailer';
import * as Q from 'q';
import { objectMerge as merge } from 'object-merge';
import * as appConfig from '../config/appconfig';

// create reusable transporter object using SMTP transport
var transporter = createTransport({
    service: 'Gmail',
    auth: appConfig.MAILER_CREDENTIALS
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

// send mail with defined transport object
var sendMailWithPromise = Q.default.denodeify.transporter.sendMail;


function prepareMailOptions(aEventsToSend, aUserName) {
  return merge(appConfig.MAIL_OPTIONS, {
    to: aUserName, // list of receivers
    subject: aEventsToSend[0].name, // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
  })
}


export function mail(aUsersToEvents) {
  return new Promise((resolve, reject) => {
    Promise.all(
      aUsersToEvents.map((aEvents, aUserName) => {
        return sendMailWithPromise(prepareMailOptions(aEvents)).then(aInfo => {
          console.log('Message sent: ' + aInfo.response);
        }, console.log)
      })
    ).then(resolve, reject);
  })
}