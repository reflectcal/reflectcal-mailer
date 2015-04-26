/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview Mailer test suite.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { filterUpcomingEvents } from '../main/daemons/mailer';
import { install } from 'source-map-support';
install();

describe("A mailer suite", () => {
  it("produces empty list from empty list", () => {
    expect(filterUpcomingEvents([])).toBe([]);
  });

});
