'use strict';

module.exports = function(app, callback) {
    const publisher = require('../../lib/rabbitmq/pub');
    publisher.start(function(err) {
        if(err) return callback(err);
        console.log('🐇 MQ producer started.');
        callback();
    });
};
