'use strict'
const publisher = require('../lib/rabbitmq/producer')

module.exports = function (Wechat) {
  Wechat.afterRemote('create', function (ctx, wechat, next) {
    const message = wechat
    publisher.publish(message, wechat.queue, function () {
      next()
    })
  })
}
