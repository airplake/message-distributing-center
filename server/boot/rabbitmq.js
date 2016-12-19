'use strict';

module.exports = function (server) {
    const AmqpConnection = require('amqpsms');
    global.amqpConnection = new AmqpConnection('amqp://admin:EiTUT7uexsBO@localhost:5672');
    amqpConnection.connect().then();
};
