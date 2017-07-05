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
      queueName: 'sms-alidayu',
      require: 'mdc-sms-alidayu',
      clientOption :{
      'appkey': process.env.APPKEY,//阿里大于appkey
      'appsecret': process.env.APPSECRET,//阿里大于appsecret
      },
      smsOption :{
      'extend': '',//String     可选 公共回传参数，在“消息返回”中会透传回该参数；举例：用户可以传入自己下级的会员ID，在消息返回时，该会员ID会包含在内，用户可以根据该会员ID识别是哪位会员使用了你的应用
      'sms_type': process.env.SMS_TYPE, //短信类型，传入值请填写normal
      'sms_free_sign_name': process.env.SMS_FREE_SIGN_NAME,  //短信签名
     // 'sms_template_code': process.env.SMS_TEMPLATE_CODE  //短信模板ID
      }
    }]
  },
  wechatTemplate: {
    '1': process.env.WECHAT_TEMPLATE_ID
  }
}

