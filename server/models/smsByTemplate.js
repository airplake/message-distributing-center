'use strict'

const publisher = require('../lib/rabbitmq/producer')

module.exports = function (sms) {
  sms.afterRemote('create', function (ctx, sms, next) {
    let message = {
      message: {
        tel: sms.phone,
        code: sms.code,
        templateId: process.env.SMS_TEMPLATE_CODE
      }
    }
    publisher.publish(message, 'sms-alidayu', function () {
      next()
    })
  })
}
