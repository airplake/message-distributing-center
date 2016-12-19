'use strict';

module.exports = function (sms) {
    sms.beforeRemote('create', function (context, user, next) {
        var req = context.req;
        req.body.code = MathRand();
        req.body.createtime = new Date();
        next();
    });
};

function MathRand() {
    var num = "";
    for (var i = 0; i < 6; i++) {
        var random = Math.floor(Math.random() * 10);
        num += random == 0 ? 1 : random;
    }
    return num;
}

