'use strict'
const publisher = require('../lib/rabbitmq/producer')
const wechatTemplate = require('config').wechatTemplate

module.exports = function (Wechat) {
  Wechat.afterRemote('create', function (ctx, wechat, next) {
    switch (wechat.emit) {
      case 'sendTemplate' :
        wechat.message.templateId = wechatTemplate[wechat.message.templateId]
        break
      default:
        break
    }
    const message = wechat
    publisher.publish(message, 'wechat', function () {
      next()
    })
  })
}
