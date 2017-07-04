'use strict'
var app = require('../../server/server')
module.exports = function (sms) {
  sms.beforeRemote('create', function (context, user, next) {
      let req = context.req
        let smsByTemplate = app.get('smsByTemplate')
        let content = smsByTemplate[req.body.templateid].replace('{0}', req.body.message)
        req.body.message = content
        amqpConnection.publish('SmsExchangeProd', 'sms', JSON.stringify({
          tel: req.body.tel, // 电话
          content: content  // 模板参数
        }), 'direct')
        next()
    })
};
