'use strict';

module.exports = function (server) {
    const AmqpConnection = require('amqpsms');
    const clientOption = {
        'appkey': '23569268',
        'appsecret': '57ddd04eebae351ec4afee97c8d75ac4',
        'REST_URL': 'gw.api.taobao.com/router/rest'
    }

    const smsOption = {
        'extend': '',
        'sms_type': 'normal',
        'sms_free_sign_name': '夜点',
        'sms_param': '',
        'rec_num': '',
        'sms_template_code': 'SMS_34335476'
    }

    global.amqpConnection = new AmqpConnection('amqp://admin:EiTUT7uexsBO@localhost:5672', { clientOption, smsOption });
    amqpConnection.connect().then();
};
