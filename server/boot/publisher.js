module.exports = function (app, callback) {
  const publisher = require('../lib/rabbitmq/producer')
  // console.log('Connecting to RabbitMQ...')
  publisher.start(function (err) {
    if (err) return callback(err)
    console.log('Connecting to RabbitMQ...')
    callback()
  })
}
