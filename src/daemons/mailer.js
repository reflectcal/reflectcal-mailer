/*
 * Copyright (c) 2015. Epam, Alex K.
 */

/**
 * @fileoverview Core for mailer daemon.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as appConfig from '../config/appconfig';
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


  }
  checkTimer = setTimeout(notificationLoopCallback, SECOND);
}

