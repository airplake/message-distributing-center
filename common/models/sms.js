'use strict';
var app = require('../../server/server');
module.exports = function (sms) {
    sms.beforeRemote('create', function (context, user, next) {
        var req = context.req;
        req.body.code = MathRand();
        req.body.createtime = new Date();
        next();
    });

    sms.afterRemote('create', function (ctx, modelInstance, next) {
        let content = `感谢您下载并注册夜点，预订KTV要派对不排队，您的验证码是${modelInstance.code.toString()} 【夜点应用】`;
        amqpConnection.publish('SmsExchange', 'sms', JSON.stringify({
            tel: modelInstance.phone,//电话
            content: content  //模板参数
        }), 'direct');
        next();
    })

    sms.verification = function (req, res) {
        var smsModel = app.loopback.findModel('sms');
        smsModel.findOne({ where: { phone: req.body.phone }, order: 'id DESC' }, function (err, sms) {
            if (err) return res.jsonp({ errcode: 500, errmsg: err });
            if (!sms) return res.jsonp({ errcode: 403, errmsg: '验证失败' });
            if (req.body.code == sms.code) {
                sms.updateAttribute('prooftime', new Date(), function (err, r) {
                    if (err) return res.jsonp({ errcode: 500, errmsg: err });
                    res.jsonp({ code: 200, msg: '验证成功' });
                })
            } else {
                res.jsonp({ errcode: 403, errmsg: '验证失败' });
            }
        });
    }
    sms.remoteMethod(
        'verification',
        {
            //accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
            ],
            http: { path: '/verification', verb: 'post' }
            //returns: { arg: 'result', type: 'object' }
        }
    );

    sms.remoteMethod(
        'post',
        {
            //accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
            ],
            http: { path: '/verification', verb: 'post' }
            //returns: { arg: 'result', type: 'object' }
        }
    );
};

function MathRand() {
    var num = "";
    for (var i = 0; i < 6; i++) {
        var random = Math.floor(Math.random() * 10);
        num += random == 0 ? 1 : random;
    }
    return num;
}

