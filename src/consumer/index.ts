require('dotenv').config(); // eslint-disable-line
const consumer = require('../lib/rabbitmq/worker')

consumer.start(function () {
  console.log('Consumer started.')
})
