/**
 * XadillaX <i@2333.moe> created at 2017-02-21 22:07:52 with ❤
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
let publisher;

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
                queues[key] = queue;
                callback();
            });
        }, function() {
            conn.exchange('', {
                type: 'direct',
                durable: true,
                autoDelete: false,
                confirm: true
            }, function(exchange) {
                console.log('Publisher initialized.');
                publisher = exchange;
                callback();
            });
        });
    });
};

exports.publish = function(message, consumerAdapter, callback) {
    const retry = arguments[3] || 0;
    const routingKey = `${CHANNEL}.${consumerAdapter}`;
    publisher.publish(routingKey, message, {
        deliveryMode: 2,
        contentType: 'application/json'
    }, function(failed) {
        if(failed) {
            // retry for 5 times
            if(retry < 5) {
                console.error(`Failed to publish message. Retry for ${retry} times.`);
                return exports.publish(message, consumerAdapter, callback, retry + 1);
            }

            return callback(new Error('Failed to publish message', message));
        }

        console.error('RabbitMQ message sent.');
        callback();
    });
};
