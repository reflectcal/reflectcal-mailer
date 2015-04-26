/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { filterUpcomingEvents } from '../main/daemons/mailer';
import { objectMerge as merge } from 'object-merge';
import { install } from 'source-map-support';
install();


const ALERT_INTERVAL = 900000;
const EVENT_DURATION = 1000 * 60 * 60;
const MINUTE = 1000 * 60;


var alertProto = {
  type : 0,
  interval : ALERT_INTERVAL
}


function createAlert(aType) = {
  return merge(alertProto, {
    type: aType
  });
}


var eventProto = {
  _id : '',
  alerts : [
  ],
  calendarId : '',
  allDay : false,
  description : '',
  name : '',
  end : 0,
  start : 0
}


function createUpcomingEvent(aType) = {
  var event = merge(eventProto, {
    start : ALERT_INTERVAL,
    end : ALERT_INTERVAL + EVENT_DURATION,
  });
}


function createUpcomingOnEdgeEvent(aType) = {
  var event = merge(eventProto, {
    start : ALERT_INTERVAL + (MINUTE - 1),
    end : ALERT_INTERVAL + (MINUTE - 1) + EVENT_DURATION,
  });
}


function createNotUpcomingEvent(aType) = {
  var event = merge(eventProto, {
    start : ALERT_INTERVAL + MINUTE,
    end : ALERT_INTERVAL + MINUTE + EVENT_DURATION,
  });
}


export var findWithPromiseMock = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 0)
  })
}


export var findWithPromiseErrorMock = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 0)
  })
}