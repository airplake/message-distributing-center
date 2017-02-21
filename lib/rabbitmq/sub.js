/**
 * XadillaX <i@2333.moe> created at 2017-02-21 22:29:58 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

const async = require('async');

const Conn = require('./conn');

const CONSUMER_ADAPTERS = require('../../server/config').pubsub.consumerAdapters;
const CHANNEL = require('../../server/config').pubsub.channel;

const queues = {};
let conn;

function listener(consumerAdapter, message, headers, deliveryInfo, ack) {
    const adapter = require(consumerAdapter);
    adapter.emit('message', message, ack);
}

exports.start = function(callback) {
    Conn.connect(function(err, _conn) {
        if(err) return callback(err);

        conn = _conn;
        async.eachLimit(CONSUMER_ADAPTERS, 10, function(key, callback) {
            conn.queue(`${CHANNEL}.${key}`, {
                durable: true,
                autoDelete: false
            }, function(queue) {
                console.log(`Queue ${CHANNEL}.${key} initialized.`);

                queue.bind('#');
                queue.subscribe({
                    ack: true,
                    prefetchCount: 50
                }, listener.bind(null, key)).addCallback(function() {
                    queues[key] = queue;
                    callback();
                });
            });
        }, function() {
            callback();
        });
    });
};
