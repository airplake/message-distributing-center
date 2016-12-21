const AmqpConnection = require('airplake-mdc-sms-alidayu');
global.amqpConnection = new AmqpConnection('amqp://admin:EiTUT7uexsBO@localhost:5672');
amqpConnection.connect().then();

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

amqpConnection.consume({ clientOption, smsOption }, 'SmsExchange', 'sms queue', 'sms', 'direct'); 