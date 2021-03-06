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
 * Name of db.
 * @type {string}
 */
const DB_NAME = 'rflectevents';


/**
 * Host of db.
 * @type {string}
 */
export const DB_URL = 'mongodb://' + process.env.DB_URL + '/' + DB_NAME;


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


var credsObject = JSON.parse(process.env.CREDS_OBJECT);

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
