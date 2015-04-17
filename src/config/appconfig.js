/*
 * Copyright (c) 2015. Reflect, Alex K.
 */

/**
 * @fileoverview Application configuration.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as bunyan from 'bunyan';
import { install } from 'source-map-support';
install();


/**
 * Whether application is compiled. This affects whether compiled sources from
 * /js folder or uncompiled ones from /src will be used.
 * @type {boolean}
 */
export const COMPILED = true;


/**
 * Whether application is built. This means that assets like js and css have
 * unique md5 names and targets are linked to that assets.
 * Overridden to true by build process.
 * @type {boolean}
 */
export const BUILT = false;


/**
 * Name of db.
 * @type {string}
 */
export const DB_NAME = 'rflectevents';


/**
 * Whether to use oauth authentication. If false, fallback to local strategy.
 * @type {boolean}
 */
export const USE_OAUTH = true;


/**
 * Whether to use local authentication. If false, fallback to guest mode.
 * @type {boolean}
 */
export const USE_LOCAL_AUTH = false;


/**
 * App HTTP port.
 * @type {number}
 */
export const APP_PORT = BUILT ? 80 : 3000;


/**
 * Port for web sockets.
 * @type {number}
 */
export const WEBSOCKETS_PORT = 3002;


/**
 * Path for notifications web sockets.
 * @type {string}
 */
export const WEBSOCKETS_NOTIFICATIONS_PATH = '/notifications';


/**
 * Whether to perform user setup, i.e. add default calendars and events.
 * Interface may look more friendly with some events and calendars already set.
 * @type {boolean}
 */
export const PERFORM_SET_UP_USER = true;


/**
 * Whether to send user notifications through web sockets, for example, when
 * someone edits calendar they are subscribed to, etc.
 * @type {boolean}
 */
export const USE_WEBSOCKETS_NOTIFICATIONS = false;


/**
 * List of locales.
 * @type {Array.<string>}
 */
export const LOCALES = ['en', 'ru', 'by', 'fr'];


/**
 * List of (locale, lang name) pairs.
 * @type {Array.<Array.<string>>}
 */
export const LANGUAGE_NAMES = [
  ['en', 'English'],
  ['ru', 'Русский'],
  ['by', 'Беларускi'],
  ['fr', 'Français']
];


/**
 * String prepended to JSON to avoid xss.
 * @type {string}
 * @const
 */
export const JSON_XSS_PREPENDER = '])}>"';


/**
 * Logger.
 */
export const log = bunyan.default.createLogger({
  name: 'reflectcal-mailer',
  streams: [
    {
      level: 'info',
      type: 'stream',
      stream: process.stdout
    },
    {
      level: 'info',
      type: 'rotating-file',
      path: 'logs/info.log',
      period: '1d',
      count: 10
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: 'logs/error.log',
      period: '1d',
      count: 10
    }
  ]
});


