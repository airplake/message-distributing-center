const AmqpConnection = require('airplake-mdc-sms-alidayu');
const config = require('./config');
global.amqpConnection = new AmqpConnection(config.rabbitmq);
amqpConnection.connect().then();
amqpConnection.consumeBySDK(config.sdk, 'SmsExchange', 'sms queue', 'sms', 'direct'); 