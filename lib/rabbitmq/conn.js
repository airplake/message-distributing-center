/**
 * XadillaX <i@2333.moe> created at 2017-02-21 21:41:30 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

const amqp = require('amqp');

const RABBITMQ_URL = require('../../server/config').pubsub.connection;

let conn;
let connected = false;
let connecting = false;

/**
 * connect to AMQP and get the connection
 * @param {Function} callback the callback function
 * @return {Undefined} no return
 */
exports.connect = function(callback) {
    if(connected) {
        return process.nextTick(function() {
            callback(undefined, conn);
        });
    }

    if(connecting) {
        return conn.once('ready', function() {
            callback(undefined, conn);
        });
    }

    conn = amqp.createConnection(RABBITMQ_URL, { reconnect: true });
    connecting = true;
    conn.once('ready', function() {
        connecting = false;
        connected = true;
        console.log('🐰 MQ connected.');
        callback(undefined, conn);
    });
};
