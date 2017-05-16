'use strict';

const publisher = require('../../lib/rabbitmq/pub');

module.exports = function(Wechat) {
    Wechat.afterRemote('create', function(ctx, wechat, next) {
        const message = {
            to: wechat.to,
            templateId: wechat.templateId,
            data: wechat.data,
            url: wechat.url
        };
        publisher.publish(message, wechat.queue, function() {
            next();
        });
    });
};
