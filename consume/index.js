const consumer = require('../server/lib/rabbitmq/worker')
consumer.start(function () {
  console.log('Consumer started.')
})
