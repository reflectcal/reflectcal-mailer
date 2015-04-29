/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as merge from 'object-merge';
import * as constants from './constants';
import * as calMock from './calendar';
import * as eventMock from './event';
import { install } from 'source-map-support';
install();


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