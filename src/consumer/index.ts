require('dotenv').config(); // eslint-disable-line
const consumer = require('../lib/rabbitmq/worker')

consumer.start(function (err:Error) {
  if(err) return  console.log(`rabbitmq error`,err);
  console.log('Consumer started.')
})
