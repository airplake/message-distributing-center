'use strict';

module.exports = function (server) {
    const app = require('../server');
    const AmqpConnection = require('airplake-mdc-sms-alidayu');
    global.amqpConnection = new AmqpConnection(app.get('rabbitmq'));
    amqpConnection.connect().then();
    //"rabbitmq":"amqp://yedian:yedian123outfox@dev-api.chinacloudapp.cn:5672",
};
