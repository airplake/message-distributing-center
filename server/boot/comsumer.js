'use strict';

module.exports = function(app, callback) {
  const subscriber = require('../../lib/rabbitmq/sub');
  subscriber.start(function(err) {
    if(err) return callback(err);
    callback();
    console.log('Consumer subscriber started.');
  });
};
