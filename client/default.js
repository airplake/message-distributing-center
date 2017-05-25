module.exports = {

  queue: {
       // connection: 'amqp://yedian:yedian123outfox@staging-api.chinacloudapp.cn:5672',
    connection: 'amqp://admin:admin@192.168.1.9:5672',
    channel: 'MDC_QUEUE',
    consumerAdapters: [{
      queueName: 'email',
      require: 'mdc-email-smtp'
    }, {
      queueName: 'wechat',
      require: 'mdc-weixin',
      tokenUrl: 'http://dev-yedian.chinacloudapp.cn:4000/internal/user/wechat/accessToken'
    }]
  }
}
