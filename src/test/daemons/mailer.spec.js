/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import {
  filterUpcomingEvents,
  groupByUserName,
  getUsersForCalendarIdWithPromise
} from './../../main/daemons/mailer';
import { install } from 'source-map-support';
import * as db from './../mocks/db';
install();
goog.require('goog.array');


describe('A filterUpcomingEvents', () => {
  it('produces empty list from empty list', () => {
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

  it('should filter upcoming events', () => {
    expect(filterUpcomingEvents(0, list)).toContain(upcomingEvent);
    expect(filterUpcomingEvents(0, list)).toContain(upcomingOnEdgeEvent);
    expect(filterUpcomingEvents(0, list)).not.toContain(notUpcomingEvent);
  });

  it('should filter events with alert type TYPE_MAIL', () => {
    expect(filterUpcomingEvents(0, list)).not.toContain(upcomingEventOfNonMailType);
  });
});


describe('A groupByUserName', () => {
  var calendarIdToUsers = new Map();
  const USER1 = 'a1@a.com';
  const USER2 = 'b1@b.com';
  const USER3 = 'c1@c.com';
  calendarIdToUsers.set('A', [USER1]);
  calendarIdToUsers.set('B', [USER1, USER2]);
  calendarIdToUsers.set('C', [USER3]);

  var events = db.createEventSeqForCalendar('A').
      concat(db.createEventSeqForCalendar('B')).
      concat(db.createEventSeqForCalendar('C'));
  var eventsGroupedByCalendar = goog.array.bucket(events, aEvent =>
      aEvent.calendarId);

  var getUsersForCalendarIdWithPromiseMockWithBoundCalToUsersMap =
      db.getUsersForCalendarIdWithPromiseMock.bind(this, calendarIdToUsers)
  var groupByUserNameWithBoundDb = groupByUserName.bind(this,
      getUsersForCalendarIdWithPromiseMockWithBoundCalToUsersMap);

  it('should map events to users of present calendars', done => {
    groupByUserNameWithBoundDb(eventsGroupedByCalendar).then(aUsersToEvents => {

      expect(aUsersToEvents.has(USER1)).toBe(true);
      expect(aUsersToEvents.has(USER2)).toBe(true);
      expect(aUsersToEvents.has(USER3)).toBe(true);
      expect(aUsersToEvents.size).toBe(3);
      expect(aUsersToEvents.has('nonexistent@some.com')).toBe(false);
      done();
    })
  });
  
  it('should put events under users which have access to these events\' ' +
      'calendars', done => {
    groupByUserNameWithBoundDb(eventsGroupedByCalendar).then(aUsersToEvents => {
      expect(aUsersToEvents.get(USER2).every(aEvent =>
          aEvent.calendarId == 'B')).toBe(true);
      expect(aUsersToEvents.get(USER3).every(aEvent =>
          aEvent.calendarId == 'C')).toBe(true);

      expect(aUsersToEvents.get(USER2).some(aEvent =>
          aEvent.calendarId == 'A' || aEvent.calendarId == 'C')).toBe(false);
      expect(aUsersToEvents.get(USER3).some(aEvent =>
          aEvent.calendarId == 'A' || aEvent.calendarId == 'B')).toBe(false);

      done();
    })
  });

  it('should correctly process concurrent calendars', done => {
    groupByUserNameWithBoundDb(eventsGroupedByCalendar).then(aUsersToEvents => {
      expect(aUsersToEvents.get(USER1).some(aEvent =>
          aEvent.calendarId == 'A')).toBe(true);
      expect(aUsersToEvents.get(USER1).some(aEvent =>
          aEvent.calendarId == 'B')).toBe(true);
      expect(aUsersToEvents.get(USER1).every(aEvent =>
          aEvent.calendarId == 'A' || aEvent.calendarId == 'B')).toBe(true);

      done();
    })
  })

  it('should produce empty map on empty input', done => {
    groupByUserNameWithBoundDb({}).then(aUsersToEvents => {
      expect(aUsersToEvents.size).toBe(0);
      done();
    })
  });

  var groupByUserNameWithBoundErrorDb = groupByUserName.bind(this,
      db.getUsersForCalendarIdWithPromiseMockError);

  it('should reject resulting promise on errors within DB promise', done => {
    groupByUserNameWithBoundErrorDb(eventsGroupedByCalendar).then(
        aUsersToEvents => {}, aError => {
      expect(aError).toBeTruthy();
      done();
    })
  });
});


describe('A getUsersForCalendarIdWithPromise', () => {
  const USER1 = 'a1@a.com';
  const USER2 = 'b1@b.com';
  const USER3 = 'c1@c.com';
  const USER4 = 'd1@d.com';
  const USER5 = 'e1@e.com';

  var calendarWithoutViewersAndEditors = db.createCalendar({
    _id: 'A',
    owner: USER1
  });
  delete calendarWithoutViewersAndEditors.viewers;
  delete calendarWithoutViewersAndEditors.editors;

  var calendarWithViewersAndEditors = db.createCalendar({
    _id: 'B',
    owner: USER1,
    viewers: [USER2, USER3],
    editors: [USER4, USER5]
  });

  var calendarWithoutEditors = db.createCalendar({
    _id: 'C',
    owner: USER1,
    viewers: [USER2, USER3]
  });
  delete calendarWithoutViewersAndEditors.editors;

  var calendarWithoutViewers = db.createCalendar({
    _id: 'D',
    owner: USER1,
    editors: [USER2, USER3]
  });
  delete calendarWithoutViewersAndEditors.viewers;

  var calendarWithEmptyViewersAndEditors = db.createCalendar({
    _id: 'E',
    owner: USER1,
    viewers: [],
    editors: []
  });

  var calendarIdToCalendar = new Map();
  calendarIdToCalendar.set('A', [calendarWithoutViewersAndEditors]);
  calendarIdToCalendar.set('B', [calendarWithViewersAndEditors]);
  calendarIdToCalendar.set('C', [calendarWithoutEditors]);
  calendarIdToCalendar.set('D', [calendarWithoutViewers]);
  calendarIdToCalendar.set('E', [calendarWithEmptyViewersAndEditors]);

  var getCalendarsWithPromiseMockWithBoundMap = db.getCalendarsWithPromiseMock.
      bind(this, calendarIdToCalendar);

  var getUsersForCalendarIdWithPromiseWithBoundDb =
      getUsersForCalendarIdWithPromise.bind(this,
      getCalendarsWithPromiseMockWithBoundMap)

  it('should correctly omit undefined viewers and editors', done => {
    getUsersForCalendarIdWithPromiseWithBoundDb('A').then(aUserNames => {
      expect(aUserNames).toEqual([USER1]);
      done();
    });
  });

  it('should include owner, viewers, editors', done => {
    getUsersForCalendarIdWithPromiseWithBoundDb('B').then(aUserNames => {
      expect(aUserNames.sort()).toEqual([USER1, USER2, USER3, USER4, USER5].
          sort());
      done();
    });
  });

  it('should correctly omit undefined editors', done => {
    getUsersForCalendarIdWithPromiseWithBoundDb('C').then(aUserNames => {
      expect(aUserNames).toEqual([USER1, USER2, USER3]);
      done();
    });
  });

  it('should correctly omit undefined viewers', done => {
    getUsersForCalendarIdWithPromiseWithBoundDb('D').then(aUserNames => {
      expect(aUserNames).toEqual([USER1, USER2, USER3]);
      done();
    });
  });

  it('should correctly work with empty viewers and editors', done => {
    getUsersForCalendarIdWithPromiseWithBoundDb('E').then(aUserNames => {
      expect(aUserNames).toEqual([USER1]);
      done();
    });
  });

});
