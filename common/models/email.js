'use strict';

const path = require('path');

const config = require('config');

const publisher = require('../../lib/rabbitmq/pub');

module.exports = function(Email) {
    Email.afterRemote('create', function(ctx, email, next) {
        const message = {
            from: `${email.fromDisp} <${config.queue.consumerAdapters.reduce(
                (ret, conf) => {
                    if(conf.queueName === email.queue) {
                        return conf.address;
                    } else {
                        return ret;
                    }
                }, '')}>`,
            to: email.to,
            subject: email.subject,
            template: path.resolve(__dirname, '../../templates/email', `${email.template}.ejs`),
            var: email.variables
        };
        publisher.publish(message, email.queue, function() {
            next();
        });
    });
};
