/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Event mocks.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as merge from 'object-merge';
import * as constants from './constants';
import { install } from 'source-map-support';
install();


var alertProto = {
  type : 3,
  interval : constants.ALERT_INTERVAL
}


function createAlert(aType) {
  return merge.default(alertProto, {
    type: aType
  });
}


var eventProto = {
  _id : '',
  alerts : [],
  calendarId : '',
  allDay : false,
  description : '',
  name : '',
  end : 0,
  start : 0
}

export function createUpcomingEvent() {
  var start = constants.ALERT_INTERVAL;
  var event = merge.default(eventProto, {
    start: start,
    end: start + constants.EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(constants.TYPE_MAIL));
  return event;
}


export function createUpcomingOnEdgeEvent() {
  var start = constants.ALERT_INTERVAL + (constants.MINUTE - 1);
  var event = merge.default(eventProto, {
    start: start,
    end: start + constants.EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(constants.TYPE_MAIL));
  return event;
}


export function createNotUpcomingEvent() {
  var start = constants.ALERT_INTERVAL + constants.MINUTE;
  var event = merge.default(eventProto, {
    start : start,
    end : start + constants.EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(constants.TYPE_MAIL));
  return event;
}


export function createUpcomingEventOfNonMailType() {
  var start = constants.ALERT_INTERVAL;
  var event = merge.default(eventProto, {
    start: start,
    end: start + constants.EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(0));
  return event;
}


export function createEventForCalendar(aCalendarId) {
  var event = createUpcomingEvent();
  event.calendarId = aCalendarId;
  return event;
}


export function createEventSeqForCalendar(aCalendarId) {
  var events = [];
  var seqLength = Math.floor(Math.random() * 10);
  for (let counter = 0; counter < seqLength; counter++) {
    events.push(createEventForCalendar(aCalendarId));
  }
  return events;
}