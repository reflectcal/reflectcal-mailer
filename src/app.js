/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview App main file.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { Mailer } from './daemons/mailer';
import { install } from 'source-map-support';
/*
 * Enable es6 -> es5 source maps.
 * http://www.2ality.com/2015/04/node-es6-transpiled.html
 */
install();
/*
 * Enable Closure Library.
 * https://code.google.com/p/closure-library/wiki/NodeJS
 */
require('google-closure-library/closure/goog/bootstrap/nodejs');

Mailer.start();
