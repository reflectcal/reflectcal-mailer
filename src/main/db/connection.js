/*
 * Copyright (c) 2015. Reflect, Alex K.
 */

/**
 * @fileoverview DB connection.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import * as appConfig from './../config/appconfig';
import { install } from 'source-map-support';
import * as mongo from 'mongoskin';
install();


export const db = mongo.default.db(appConfig.DB_URL, {native_parser:true});


