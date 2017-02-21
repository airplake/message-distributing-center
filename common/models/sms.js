'use strict';

const app = require('../../server/server');

function mathRand() {
    let num = '';
    for(let i = 0; i < 6; i++) {
        const random = Math.floor(Math.random() * 10);
        num += random === 0 ? 1 : random;
    }
    return num;
}

module.exports = function(sms) {
    sms.beforeRemote('create', function(context, user, next) {
        const req = context.req;
        req.body.code = mathRand();
        req.body.createtime = new Date();
        next();
    });

    sms.afterRemote('create', function(ctx, modelInstance, next) {
        const content = `感谢您下载并注册夜点，预订KTV要派对不排队，您的验证码是${modelInstance.code.toString()} ` +
            '【夜点应用】';
        amqpConnection.publish('SmsExchange', 'sms', JSON.stringify({
            tel: modelInstance.phone,   // 电话
            content: content            // 模板参数
        }), 'direct');
        next();
    });

    sms.verification = function(req, res) {
        const smsModel = app.loopback.findModel('sms');
        smsModel.findOne({ where: { phone: req.body.phone }, order: 'id DESC' }, function(err, _sms) {
            if(err) return res.jsonp({ errcode: 500, errmsg: err });
            if(!_sms) return res.jsonp({ errcode: 403, errmsg: '验证失败' });
            if(parseInt(req.body.code) === parseInt(_sms.code)) {
                _sms.updateAttribute('prooftime', new Date(), function(err) {
                    if(err) return res.jsonp({ errcode: 500, errmsg: err });
                    return res.jsonp({ code: 200, msg: '验证成功' });
                });
            } else {
                return res.jsonp({ errcode: 403, errmsg: '验证失败' });
            }
        });
    };

    sms.remoteMethod(
        'verification',
        {
            // accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
            accepts: [
                { arg: 'req', type: 'object', http: { source: 'req' }},
                { arg: 'res', type: 'object', http: { source: 'res' }}
            ],
            http: { path: '/verification', verb: 'post' }

            // returns: { arg: 'result', type: 'object' }
        }
    );
};
