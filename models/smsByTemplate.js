'use strict'

const publisher = require('../lib/rabbitmq/producer')
const smsTemplate = require('config').smsTemplate

module.exports = function (sms) {
  sms.afterRemote('create', function (ctx, sms, next) {
    let message = {
      message: {
        PhoneNumbers: sms.tel, // 要发送到短信的手机
        SignName: process.env.SMS_FREE_SIGN_NAME, // 短信签名，阿里云短信平台申请
        TemplateCode: smsTemplate[sms.templateid], // 短信模板Code，阿里云短信平台申请
        TemplateParam: `{"name":"${sms.message}"}`, // 短信模板中参数指定，以你的为准替换之
        OutId: ''// 可选
      }
    }
    publisher.publish(message, 'sms-aliyun', function () {
      next()
    })
  })
}
