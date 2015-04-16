/*
 * Copyright (c) 2015. Alex K.
 */

/**
 * @fileoverview App main file.
 * @author alexeykofficial@gmail.com (Alex K.)
 */


import { Mailer } from './daemons/mailer';
import { install } from 'source-map-support';
install();


Mailer.start();
