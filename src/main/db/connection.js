/*
 * Copyright (c) 2015. Reflect, Alex K.
 */

/**
 * @fileoverview DB connection.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as mongo from 'mongodb';
import * as monk from 'monk';
import * as appConfig from './../config/appconfig';
import { install } from 'source-map-support';
install();


export const db = monk.default(appConfig.DB_SERVER + ':' + appConfig.DB_PORT +
    '/' + appConfig.DB_NAME);


