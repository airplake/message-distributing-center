var conn = require('./channel')
const async = require('async')

const CONSUMER_ADAPTERS = require('config').queue.consumerAdapters
const CHANNEL = require('config').queue.channel
let ch

exports.start = function (callback) {
  conn.createChannel().then((channel) => {
    ch = channel
    ch.assertExchange(`mdc`, 'direct', { durable: true, autoDelete: false })
    async.eachLimit(CONSUMER_ADAPTERS, 10, function (adapter, callback) {
      ch.assertQueue(`${CHANNEL}.${adapter.queueName}`, { durable: true, autoDelete: false })
      ch.bindQueue(`${CHANNEL}.${adapter.queueName}`, `mdc`, `${CHANNEL}.${adapter.queueName}`)
      ch.consume(`${CHANNEL}.${adapter.queueName}`, (msg) => {
        if (msg !== null) {
          let message = JSON.parse(msg.content.toString())
          require(adapter.require).create(adapter).emit(message.emit || 'message', message.message, function (err) {
            if (err) {
              ch.ack(msg)
              return new Error(`Failed to comsume message ${msg.content.toString()}`)
            }
            ch.ack(msg)
          })
        }
      }, { noAck: false })
      callback()
    }, function () {
      callback()
    })
  })
}
