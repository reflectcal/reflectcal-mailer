/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Calendar mocks.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as merge from 'object-merge';
import { install } from 'source-map-support';
install();


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