/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import {
  filterUpcomingEvents,
  groupByUserName
} from './../../main/daemons/mailer';
import { install } from 'source-map-support';
import * as db from './../mocks/db';
install();
goog.require('goog.array');


describe("A filterUpcomingEvents", () => {
  it("produces empty list from empty list", () => {
    expect(filterUpcomingEvents(0, [])).toEqual([]);
  });

  var upcomingEvent = db.createUpcomingEvent();
  var upcomingOnEdgeEvent = db.createUpcomingOnEdgeEvent();
  var notUpcomingEvent = db.createNotUpcomingEvent();
  var upcomingEventOfNonMailType = db.createUpcomingEventOfNonMailType();
  var list = [];
  list.push(upcomingEvent);
  list.push(upcomingOnEdgeEvent);
  list.push(notUpcomingEvent);
  list.push(upcomingEventOfNonMailType);

  it("should filter upcoming events", () => {
    expect(filterUpcomingEvents(0, list)).toContain(upcomingEvent);
    expect(filterUpcomingEvents(0, list)).toContain(upcomingOnEdgeEvent);
    expect(filterUpcomingEvents(0, list)).not.toContain(notUpcomingEvent);
  });

  it("should filter events with alert type TYPE_MAIL", () => {
    expect(filterUpcomingEvents(0, list)).not.toContain(upcomingEventOfNonMailType);
  });
});


describe("A groupByUserName", () => {
  var calendarIdToUsers = new Map();
  const USER1 = 'a1@a.com';
  const USER2 = 'b1@b.com';
  const USER3 = 'c1@c.com';
  calendarIdToUsers.set('A', USER1);
  calendarIdToUsers.set('B', [USER1, USER2]);
  calendarIdToUsers.set('C', USER3);

  var events = db.createEventSeqForCalendar('A').
      concat(db.createEventSeqForCalendar('B')).
      concat(db.createEventSeqForCalendar('C'));
  var eventsGroupedByCalendar = goog.array.bucket(events, aEvent =>
      aEvent.calendarId);

  var groupByUserNameWithBoundDb = groupByUserName.bind(this, 
      db.getUsersForCalendarIdWithPromiseMock.bind(this, calendarIdToUsers));

  it("should map events to users of present calendars", (done) => {
    groupByUserNameWithBoundDb(eventsGroupedByCalendar).then(aUsersToEvents => {
      expect(aUsersToEvents.has(USER1)).toBe(true);
      expect(aUsersToEvents.has(USER2)).toBe(true);
      expect(aUsersToEvents.has(USER3)).toBe(true);
      expect(aUsersToEvents.size).toBe(3);
      expect(aUsersToEvents.has('nonexistent@some.com')).toBe(false);
      done();
    })
  });


});
