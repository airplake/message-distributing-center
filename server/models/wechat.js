'use strict'
const publisher = require('../lib/rabbitmq/producer')
const wechatTemplate = require('config').wechatTemplate

module.exports = function (Wechat) {
  Wechat.afterRemote('create', function (ctx, wechat, next) {
    wechat.message.templateId = wechatTemplate[wechat.message.templateId]
    const message = wechat
    publisher.publish(message, 'wechat', function () {
      next()
    })
  })
}
