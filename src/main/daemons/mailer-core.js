/*
 * Copyright (c) 2015. Epam, Alex K.
 */

/**
 * @fileoverview Core for mailer daemon.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { createTransport } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Q from 'q';
import * as merge from 'object-merge';
import * as appConfig from './../config/appconfig';
import * as jade from 'jade';
require('google-closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.array');


var mailTemplate = jade.default.compile(fs.default.readFileSync(path.default.
    join(__dirname, '..', '..', '..', 'templates', 'mail.jade')), {});


var transporter = createTransport({
    service: 'Gmail',
    auth: appConfig.MAILER_CREDENTIALS
});


var sendMailWithPromise = Q.default.denodeify(transporter.sendMail.bind(
    transporter));


function prepareMailOptions(aEventsToSend, aUserName) {
  var event = aEventsToSend[0];
  var formatStringDate = goog.i18n.DateTimeSymbols.DATEFORMATS[3].
      replace(/y+/, 'yyyy');
  var formatStringTime = goog.i18n.DateTimeSymbols.TIMEFORMATS[3];
  var eventName = event.name || '(Untitled)';

  var message = 'Event: ' + eventName + ' starts at ' +
      new goog.i18n.DateTimeFormat(formatStringDate).format(
      new Date(event.start)) +
      ' ' +
      new goog.i18n.DateTimeFormat(formatStringTime).format(
      new Date(event.start));

  var eventStart =
      new goog.i18n.DateTimeFormat(formatStringDate).format(
      new Date(event.start)) +
      ' ' +
      new goog.i18n.DateTimeFormat(formatStringTime).format(
      new Date(event.start));
  var eventEnd =
      new goog.i18n.DateTimeFormat(formatStringDate).format(
      new Date(event.end)) +
      ' ' +
      new goog.i18n.DateTimeFormat(formatStringTime).format(
      new Date(event.end));

  var otherEvents = aEventsToSend.length > 1 ? (aEventsToSend.length - 1) +
      ' other events start at the same time': '';

  return merge.default(appConfig.MAIL_OPTIONS, {
    to: aUserName,
    subject: message,
    text: message,
    html: mailTemplate({
      eventName: eventName,
      eventStart: eventStart,
      eventEnd: eventEnd,
      eventUser: aUserName,
      otherEvents: otherEvents
    })
  })
}


/**
 * @param {Array<rflect.cal.events.Event>} aEvents Events to be grouped.
 * @return {Array<{_1: goog.date.DateTime, _2: Array<rflect.cal.events.Event>}>}
 * Events grouped in form date -> array of events for this date.
 */
export function groupEventsByStartDate(aEvents) {
  var groupedEvents = new Map();
  //Phase 1: group events by start date.
  var eventBuckets = goog.array.bucket(aEvents, aEvent => {
    var date = new Date;
    date.setTime(aEvent.start);
    //We only group events with minute precision.
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  });
  //Phase 2: sort buckets by start date.
  var keys = [];
  for (var key in eventBuckets) {
    keys.push(key);
  }
  keys.sort().forEach(aKey => {
    var date = new goog.date.DateTime();
    date.setTime(+aKey);
    groupedEvents.set(date, eventBuckets[aKey]);

  })
  return groupedEvents;
}


export function mail(aUsersToEvents) {
  aUsersToEvents.forEach((aEvents, aUserName) => {
    console.log('User: ', aUserName);
    console.log('Events: ', aEvents);
  });

  var usersToEventsPromises = [];
  aUsersToEvents.forEach((aEvents, aUserName) => {
    var eventsGroupedByStart = groupEventsByStartDate(aEvents);
    eventsGroupedByStart.forEach((aEventsForDate, aDate) => {
      usersToEventsPromises.push(
        sendMailWithPromise(prepareMailOptions(aEventsForDate, aUserName)).
        then(aInfo => {
          console.log('Message sent: ' + aInfo.response);
        })
      )
    })
  });
  return Promise.all(usersToEventsPromises);
}