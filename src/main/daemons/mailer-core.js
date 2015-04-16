/*
 * Copyright (c) 2015. Epam, Alex K.
 */

/**
 * @fileoverview Core for mailer daemon.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { createTransport } from 'nodemailer';
import * as Q from 'q';
import * as merge from 'object-merge';
import * as appConfig from './../config/appconfig';
require('google-closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeFormat');


// create reusable transporter object using SMTP transport
var transporter = createTransport({
    service: 'Gmail',
    auth: appConfig.MAILER_CREDENTIALS
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// send mail with defined transport object
var sendMailWithPromise = Q.default.denodeify(transporter.sendMail.bind(
    transporter));


function prepareMailOptions(aEventsToSend, aUserName) {
  var event = aEventsToSend[0];
  var formatStringDate = goog.i18n.DateTimeSymbols.DATEFORMATS[3].
      replace(/y+/, 'yyyy');
  var formatStringTime = goog.i18n.DateTimeSymbols.TIMEFORMATS[3];

  var message = (event.name || '(Untitled)') + ' starts at ' +
      new goog.i18n.DateTimeFormat(formatStringDate).format(
      new Date(event.start)) +
      ' ' +
      new goog.i18n.DateTimeFormat(formatStringTime).format(
      new Date(event.start));

  return merge.default(appConfig.MAIL_OPTIONS, {
    to: aUserName,
    subject: message,
    text: message,
    html: message
  })
}


export function mail(aUsersToEvents) {
  aUsersToEvents.forEach((aEvents, aUserName) => {
    console.log('User: ', aUserName);
    console.log('Events: ', aEvents);
  });

  var usersToEventsPromises = [];
  aUsersToEvents.forEach((aEvents, aUserName) => {
    usersToEventsPromises.push(
      sendMailWithPromise(prepareMailOptions(aEvents, aUserName)).
      then(aInfo => {
        console.log('Message sent: ' + aInfo.response);
      })
    )
  });
  return Promise.all(usersToEventsPromises);
}