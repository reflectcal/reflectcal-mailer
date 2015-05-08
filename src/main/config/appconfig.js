/*
 * Copyright (c) 2015. Reflect, Alex K.
 */

/**
 * @fileoverview Application configuration.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as bunyan from 'bunyan';
import { install } from 'source-map-support';
import * as fs from 'fs';
import * as path from 'path';
install();


/**
 * Host of db.
 * @type {string}
 */
export const DB_SERVER = 'mongodb://localhost';


/**
 * Port of db.
 * @type {string}
 */
export const DB_PORT = 27017;


/**
 * Name of db.
 * @type {string}
 */
export const DB_NAME = 'rflectevents';


/**
 * List of locales.
 * @type {Array.<string>}
 */
export const LOCALES = ['en', 'ru', 'by', 'fr'];


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


var credsObject = JSON.parse(fs.default.readFileSync(path.default.join(
    __dirname, '..', '..', '..', 'mail-credentials.json')));

/**
 * Mail options.
 */
export const MAIL_OPTIONS = {
  from: credsObject.fullUsername,
  to: '',
  subject: '',
  text: '',
  html: ''
};


export const MAILER_CREDENTIALS = {
  user: credsObject.username,
  pass: credsObject.password
}
