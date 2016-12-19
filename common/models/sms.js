'use strict';

module.exports = function (sms) {
    sms.beforeRemote('create', function (context, user, next) {
        var req = context.req;
        req.body.code = MathRand();
        req.body.createtime = new Date();
        next();
    });
    
    sms.afterRemote('create', function (ctx, modelInstance, next) {
        amqpConnection.publish('test exchange', 'sms', JSON.stringify({
            tel: modelInstance.phone,//电话
            code: modelInstance.code.toString()  //模板参数
        }), 'direct');
        next();
    })
};

function MathRand() {
    var num = "";
    for (var i = 0; i < 6; i++) {
        var random = Math.floor(Math.random() * 10);
        num += random == 0 ? 1 : random;
    }
    return num;
}

