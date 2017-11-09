const conn = require('./channel')
const async = require('async')

// var queue = 'queue'
const CONSUMER_ADAPTERS = require('config').queue.consumerAdapters
const CHANNEL = require('config').queue.channel
// let publisher
let ch
// console.log('createChannel', createChannel)
exports.start = function (callback) {
  conn.createChannel().then((channel) => {
    ch = channel
    ch.assertExchange(`mdc`, 'direct', { durable: true, autoDelete: false })
    async.eachLimit(CONSUMER_ADAPTERS, 10, function (adapter, callback) {
      ch.assertQueue(`${CHANNEL}.${adapter.queueName}`, { durable: true, autoDelete: false })
      callback()
    }, function () {
      callback()
    })
  })
}

exports.publish = function (message, consumerAdapter, callback) {
  // const retry = arguments[3] || 0;
  const routingKey = `${CHANNEL}.${consumerAdapter}`
  // console.log('consumerAdapter', routingKey)
  ch.publish(`mdc`, routingKey, Buffer.from(JSON.stringify(message)), { deliveryMode: 2, contentType: 'application/json' })
  callback()
}
