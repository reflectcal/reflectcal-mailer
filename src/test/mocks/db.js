/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as merge from 'object-merge';
import { install } from 'source-map-support';
install();


export const ALERT_INTERVAL = 900000;
export const EVENT_DURATION = 1000 * 60 * 60;
export const MINUTE = 1000 * 60;
export const TYPE_MAIL = 3;


var alertProto = {
  type : 3,
  interval : ALERT_INTERVAL
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


var calendarProto = {
  name: '',
  visible: true,
  readOnly: false,
  colorCodeId: 2,
  own: true,
  owner: '',
  viewers: [],
  editors: [],
  _id: ''
}


export function createCalendar(aCalendar) {
  var calendar = merge.default(calendarProto, aCalendar);
  return calendar;
}


export function createUpcomingEvent() {
  var start = ALERT_INTERVAL;
  var event = merge.default(eventProto, {
    start: start,
    end: start + EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(TYPE_MAIL));
  return event;
}


export function createUpcomingOnEdgeEvent() {
  var start = ALERT_INTERVAL + (MINUTE - 1);
  var event = merge.default(eventProto, {
    start: start,
    end: start + EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(TYPE_MAIL));
  return event;
}


export function createNotUpcomingEvent() {
  var start = ALERT_INTERVAL + MINUTE;
  var event = merge.default(eventProto, {
    start : start,
    end : start + EVENT_DURATION,
  });
  event._id = goog.getUid(event);
  event.alerts.push(createAlert(TYPE_MAIL));
  return event;
}


export function createUpcomingEventOfNonMailType() {
  var start = ALERT_INTERVAL;
  var event = merge.default(eventProto, {
    start: start,
    end: start + EVENT_DURATION,
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


export var findWithPromiseMock = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 0)
  })
}


export function findWithPromiseErrorMock() {
  return new Promise.reject();
}


export function getUsersForCalendarIdWithPromiseMock(aCalendarIdToUsersMap,
    aCalendarId) {
  return Promise.resolve(aCalendarIdToUsersMap.get(aCalendarId) || []);
}


export function getUsersForCalendarIdWithPromiseMockError(aCalendarId) {
  return new Promise.reject();
}


export function getCalendarsWithPromiseMock(aCalendarIdToCalendarMap, aCalendarId) {
  return Promise.resolve(aCalendarIdToCalendarMap.get(aCalendarId) || []);
}