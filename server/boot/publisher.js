'use strict';

module.exports = function(app, callback) {
    const publisher = require('../../lib/rabbitmq/pub');
    console.log('Connecting to RabbitMQ...');
    publisher.start(function(err) {
        if(err) return callback(err);
        console.log('🐇 MQ producer started.');
        callback();
    });
};
