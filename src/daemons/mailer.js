/*
 * Copyright (c) 2015. Epam, Alex K.
 */

/**
 * @fileoverview Core for mailer daemon.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as appConfig from '../config/appconfig';
import { db } from '../db/connection.js'
const log = appConfig.log;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const FIFTEEN_MINUTES = MINUTE * 15;
var checkTimer;
import { install } from 'source-map-support';
install();


export const Mailer = {
  start: start,
  stop: stop,
}


function start(aServer) {
  checkTimer = setTimeout(notificationLoopCallback, SECOND);

  console.log('Started daemon for listening notifications on port ' +
      appConfig.WEBSOCKETS_PORT + '.');
}


function stop(aServer) {
  clearTimeout(checkTimer);
}


var lastCheckedTime = 0;


function notificationLoopCallback() {
  var eventsToNotifyOf;

  var now = new Date;
  now.setSeconds(0);
  now.setMilliseconds(0);

  var intervalStart = now.getTime() + FIFTEEN_MINUTES;

  //Allow body to run every minute.
  if (lastCheckedTime != intervalStart) {
    lastCheckedTime = intervalStart;

    console.log('Requesting interval from: ', new Date(intervalStart).toISOString(), ' to: ', new Date(intervalStart + MINUTE).toISOString())

    getCloseEventsWithPromise({}).then(aEvents => {
      aEvents.filter(aEvent => {
        var eventStartTime = aEvent.start;
        return (aEvent.alerts || []).some(aAlert => {
          var intervalStart = aNowTime + aAlert.interval;
          var intervalEnd = intervalStart + 1000 * 60;
          console.log('intervalStart: ', new Date(intervalStart).toISOString());
          return 3 == aAlert.type && eventStartTime >= intervalStart &&
             eventStartTime < intervalEnd;)
        })
      })
    }, log)
  }
  checkTimer = setTimeout(notificationLoopCallback, SECOND);
}


function onMinuteCallback() {
  db.get('events')

}


function getCloseEventsWithPromise(aLookupObject) {
  return new Promise(function(resolve, reject) {
    var collection = db.get('events');
    var findWithPromise = Q.denodeify(collection.find.bind(collection));
    findWithPromise(aLookupObject, {}).then(resolve, reject);
  });
}
