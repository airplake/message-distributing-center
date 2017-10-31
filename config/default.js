module.exports = {
  app: {
    host: process.env.APP_HOST || '0.0.0.0', // host
    port: process.env.APP_PORT || '4003', // port
    apiPrefix: process.env.API_PREFIX || '/' // api 前缀
  },
  db: {
    client: process.env.DB_DIALECT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_DB,
      charset: 'utf8'
    }
  },
  queue: {
        // connection: 'amqp://yedian:yedian123outfox@staging-api.chinacloudapp.cn:5672',
    connection: process.env.AMP_URL,
    channel: 'MDC_QUEUE',
    consumerAdapters: [{
      queueName: process.env.EMAIL_QUEUE,
      require: 'mdc-email-smtp'
    }, {
      queueName: process.env.WECHAT_QUEUE,
      require: 'mdc-weixin',
      tokenUrl: process.env.TOKEN_URL
    }, {
      queueName: process.env.SMS_ALIYUN_QUEUE,
      require: 'mdc-sms-aliyun',
      AccessKeyId: process.env.APPKEY, // 填写你的AccessKeyId,可以登录阿里云查找
      AccessKeySecret: process.env.APPSECRET // 填写你的AccessKeySecret，可以登录阿里云查找
    },
      {
          queueName: process.env.JPUSH_NOTIFICATION_QUEUE,
          require: 'airplake-node-JPush',
          AccessKeyId: process.env.JPUSHAPPKEY, // 填写你的appKey,可以登录极光查找
          AccessKeySecret: process.env.JPUSHMASTERSECRET // 填写你的masterSecret，可以登录极光查找
        }]
  },
  wechatTemplate: {
    '1': process.env.WECHAT_TEMPLATE_ID
  },
  smsTemplate: {
    '0': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_0
    },
    '1': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_1
    },
    '2': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_2
    },
    '3': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_3
    },
    '4': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_4
    },
    '5': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_5
    },
    '6': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_6
    },
    '7': {
      SignName: process.env.SMS_FREE_SIGN_NAME_0,
      TemplateCode: process.env.SMS_Template_7
    }
  },
  log: {
    appenders: [ // 日志
      {
        type: 'console'
      }, // 控制台输出
      {
        type: 'file',
        filename: 'logs/http.log',
        maxLogSize: 20480,
        backups: 1,
        category: 'http',
        layout: { type: 'json', separator: ',' }
      },
      {
        type: 'file',
        filename: 'logs/init.log',
        maxLogSize: 20480,
        backups: 1,
        category: 'init',
        layout: { type: 'json', separator: ',' }
      },
      {
        type: 'file',
        filename: 'logs/sms.log',
        maxLogSize: 52428800,
        backups: 2,
        category: 'sms',
        layout: { type: 'json', separator: ',' }
      },
      {
        type: 'file',
        filename: 'logs/wechat.log',
        maxLogSize: 52428800,
        backups: 1,
        category: 'wechat',
        layout: { type: 'json', separator: ',' }
      }
    ]
  }
}
