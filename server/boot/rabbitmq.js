'use strict';

const config = require('config');

module.exports = function(/** server */) {
    const AmqpConnection = require('airplake-mdc-sms-alidayu');
    global.amqpConnection = new AmqpConnection(config.queue.connection);
    amqpConnection.connect().then();
};
