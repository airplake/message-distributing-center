/**
 * XadillaX <i@2333.moe> created at 2017-02-21 22:29:58 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

const async = require('async');

const Conn = require('./conn');

const CONSUMER_ADAPTERS = require('config').queue.consumerAdapters;
const CHANNEL = require('config').queue.channel;

const queues = {};
let conn;

const adapters = {};

function listener(adapterName, message, headers, deliveryInfo, ack) {
    const adapter = adapters[adapterName];

    console.log(adapterName);
    if(adapter) {
        adapter.emit('message', message, ack);
    }
}

exports.start = function(callback) {
    Conn.connect(function(err, _conn) {
        if(err) return callback(err);

        conn = _conn;
        async.eachLimit(CONSUMER_ADAPTERS, 10, function(adapter, callback) {
            conn.queue(`${CHANNEL}.${adapter.queueName}`, {
                durable: true,
                autoDelete: false
            }, function(queue) {
                console.log(`Queue ${CHANNEL}.${adapter.queueName} initialized.`);

                try {
                    adapters[adapter.require] = require(adapter.require).create(adapter);
                } catch(e) {
                    console.error(adapter.require, '初始化失败。', e);
                }
                queue.bind('#');
                queue.subscribe({
                    ack: true,
                    prefetchCount: 50
                }, listener.bind(null, adapter.require)).addCallback(function() {
                    queues[adapter.queueName] = queue;
                    callback();
                });
            });
        }, function() {
            callback();
        });
    });
};
