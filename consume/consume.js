'use strict';

const AmqpConnection = require('airplake-mdc-sms-alidayu');
const config = require('config');

global.amqpConnection = new AmqpConnection(config.server.rabbitmq);
amqpConnection.connect().then();
amqpConnection.consumeBySDK(config.dayu, 'SmsExchange', 'sms queue', 'sms', 'direct');
