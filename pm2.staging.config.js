module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: 'mdc-user',
    script: './dist/app.js',
    env: { // all environment
      'NODE_ENV': 'staging',
      'APP_PORT': '3001',
      'WECHAT_QUEUE': 'wechat',
      'TOKEN_URL': 'http://10.0.0.27:4000/internal/user/wechat/accessToken',
      'WECHAT_TEMPLATE_ID': '1',
      'SMS_FREE_SIGN_NAME_0': '悦夜NightPlus'
    },
    'instances': 'max', // 如果是fork, 不用配置
    'exec_mode': 'cluster' // cluster or fork
  },
  {
    name: 'mdc-user-consumer-1',
    script: './dist/consumer/index.js',
    env: { // all environment
      'NODE_ENV': 'staging',
      'APP_PORT': '3001',
      'WECHAT_QUEUE': 'wechat',
      'TOKEN_URL': 'http://10.0.0.27:4000/internal/user/wechat/accessToken',
      'WECHAT_TEMPLATE_ID': '1',
      'SMS_FREE_SIGN_NAME_0': '悦夜NightPlus'
    },
    'instances': 'max', // 如果是fork, 不用配置
    'exec_mode': 'cluster' // cluster or fork
  },
  {
    name: 'mdc-venues',
    script: './dist/app.js',
    env: { // all environment
      'NODE_ENV': 'staging',
      'APP_PORT': '3023',
      'WECHAT_QUEUE': 'wechat-venues',
      'TOKEN_URL': 'http://10.0.0.27:4000/internal/venues/wechat/accessToken',
      'WECHAT_TEMPLATE_ID': '1',
      'SMS_FREE_SIGN_NAME_0': '悦夜NightPlus'
    },
    'instances': 'max', // 如果是fork, 不用配置
    'exec_mode': 'cluster' // cluster or fork
  },
  {
    name: 'mdc-venues-consumer-1',
    script: './dist/consumer/index.js',
    env: { // all environment
      'NODE_ENV': 'staging',
      'APP_PORT': '3023',
      'WECHAT_QUEUE': 'wechat-venues',
      'TOKEN_URL': 'http://10.0.0.27:4000/internal/venues/wechat/accessToken',
      'WECHAT_TEMPLATE_ID': '1',
      'SMS_FREE_SIGN_NAME_0': '悦夜NightPlus'
    },
    'instances': 'max', // 如果是fork, 不用配置
    'exec_mode': 'cluster' // cluster or fork
  }
  ]
}
