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

// send mail with defined transport object
var sendMailWithPromise = Q.default.denodeify.transporter.sendMail;


function prepareMailOptions(aEventsToSend, aUserName) {
  return merge(appConfig.MAIL_OPTIONS, {
    to: aUserName, // list of receivers
    subject: aEventsToSend[0].name, // Subject line
    text: aEventsToSend[0].name, // plaintext body
    html: aEventsToSend[0].name // html body
  })
}


export function mail(aUsersToEvents) {
  return new Promise((resolve, reject) => {
    Promise.all(
      aUsersToEvents.map((aEvents, aUserName) => {
        return sendMailWithPromise(prepareMailOptions(aEvents)).then(aInfo => {
          console.log('Message sent: ' + aInfo.response);
        })
      })
    ).then(resolve, reject);
  })
}