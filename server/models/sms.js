'use strict'
const app = require('../../server/server')
const publisher = require('../lib/rabbitmq/producer')
/**
 *
 *
 * @param {any} sms
 */
module.exports = function (sms) {
  sms.beforeRemote('create', function (context, user, next) {
    var req = context.req
    req.body.code = MathRand()
    req.body.createtime = new Date()
    next()
  })

  sms.afterRemote('create', function (ctx, sms, next) {
    // let content = `感谢您注册NightPlus夜晚生活玩乐平台，尽享夜晚玩乐资讯&福利，您的验证码是${modelInstance.code.toString()} 【NightPlus】`
    console.log('ip:' + getClientIp(ctx.req) + '_ number:' + sms.code.toString())
    let message = {
      tel: sms.phone,
      code: 'hello world'
    }

    publisher.publish(message, 'sms-alidayu', function () {
      next()
    })
  })

  sms.verification = function (req, res) {
    var smsModel = app.loopback.findModel('sms')
    smsModel.findOne({ where: { phone: req.body.phone }, order: 'id DESC' }, function (err, sms) {
      if (err) return res.jsonp({ errcode: 500, errmsg: err })
      if (!sms) return res.jsonp({ errcode: 403, errmsg: '验证失败' })
      if (req.body.code.toString() === sms.code.toString()) {
        sms.updateAttribute('prooftime', new Date(), function (err, r) {
          if (err) return res.jsonp({ errcode: 500, errmsg: err })
          res.jsonp({ code: 200, msg: '验证成功' })
        })
      } else {
        res.jsonp({ errcode: 403, errmsg: '验证失败' })
      }
    })
  }
  sms.remoteMethod(
        'verification',
    {
            // accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
      ],
      http: { path: '/verification', verb: 'post' }
            // returns: { arg: 'result', type: 'object' }
    }
    )
}

function MathRand () {
  var num = ''
  for (var i = 0; i < 6; i++) {
    var random = Math.floor(Math.random() * 10)
    num += random === 0 ? 1 : random
  }
  return num
}

var getClientIp = function (req) {
  var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || ''
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  return ip
}
