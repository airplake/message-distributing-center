const conn = require('./channel')
const async = require('async')

const log4js = require('log4js')
const logger = log4js.getLogger('consumer')


const CONSUMER_ADAPTERS = require('config').queue.consumerAdapters
const CHANNEL = require('config').queue.channel
let ch

exports.start = function (callback, retry = 0) {
  conn.createChannel().then((channel) => {
    ch = channel
    ch.assertExchange(`mdc`, 'direct', {
      durable: true,
      autoDelete: false
    })
    async.eachLimit(CONSUMER_ADAPTERS, 10, function (adapter, cb) {
      ch.assertQueue(`${CHANNEL}.${adapter.queueName}`, {
        durable: true,
        autoDelete: false
      })
      ch.bindQueue(`${CHANNEL}.${adapter.queueName}`, `mdc`, `${CHANNEL}.${adapter.queueName}`)
      ch.consume(`${CHANNEL}.${adapter.queueName}`, (msg) => {
        // ch.ack(msg)
        if (msg !== null) {
          const message = JSON.parse(msg.content.toString()) || {}
          // console.log('work:message',message)
          // if error retry 3/1 second
          async.retry({
            times: 3,
            interval: 1000
          }, function (cbr) {
            require(adapter.require).create(adapter).emit(message.emit || 'message', message.message, function (err, result) {
             

              return cbr(err, result)
            })
          }, function (err, result) {
            if(err){
             // console.log('comsumer:err',err)
              logger.info('comsumer:err',err)
            }
           // console.log('worker:err', err)
           
            ch.ack(msg)
           // return cb(err, result)
          })
        }
      }, {
        noAck: false
      })
    }, function () {
      callback()
    })
  }).catch(err => {
   
    return callback(err)
  })
}
