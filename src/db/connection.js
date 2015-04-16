/*
 * Copyright (c) 2015. Rflect, Alex K.
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


export const db = monk('localhost:27017/' + appConfig.DB_NAME);


