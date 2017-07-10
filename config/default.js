module.exports = {

  queue: {
       // connection: 'amqp://yedian:yedian123outfox@staging-api.chinacloudapp.cn:5672',
    connection: process.env.AMP_URL,
    channel: 'MDC_QUEUE',
    consumerAdapters: [{
      queueName: 'email',
      require: 'mdc-email-smtp'
    }, {
      queueName: 'wechat',
      require: 'mdc-weixin',
      tokenUrl: process.env.TOKEN_URL
    }, {
      queueName: 'sms-aliyun',
      require: 'mdc-sms-aliyun',
      AccessKeyId:process.env.APPKEY,  //填写你的AccessKeyId,可以登录阿里云查找
      AccessKeySecret:process.env.APPSECRET //填写你的AccessKeySecret，可以登录阿里云查找
    }]
  },
  wechatTemplate: {
    '1': process.env.WECHAT_TEMPLATE_ID
  },
  smsTemplate: {
    '0': process.env.SMS_Template_0, 
    '1': process.env.SMS_Template_1, 
    '2': process.env.SMS_Template_2, 
    '3': process.env.SMS_Template_3 
  }
}

