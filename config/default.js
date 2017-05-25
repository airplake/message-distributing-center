module.exports = {

  queue: {
       // connection: 'amqp://yedian:yedian123outfox@staging-api.chinacloudapp.cn:5672',
    connection: 'amqp://user:pwd@127.0.0.1:5672',
    channel: 'MDC_QUEUE',
    consumerAdapters: [{
      queueName: 'email',
      require: 'mdc-email-smtp'
    }, {
      queueName: 'wechat',
      require: 'mdc-weixin',
      tokenUrl: 'http://127.0.0.1/getAccessToken'
    }]
  }
}
