const nodemailer = require('nodemailer')
const config = require('config')


const poolconfig = {
  pool: true,
  host: 'smtp.partner.outlook.cn',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: config.get('email.user'),
    pass: config.get('email.pass')
  }
}
const smtpTransport = nodemailer.createTransport(poolconfig)

function sendMail() {
  const mailOptions = {
    from: 'xuchen@nightplus.cn', // 发件地址
    to: '503945930@qq.com', // 收件列表
    subject: 'mdc消息服务报警，请检查', // 标题
    html: `mdc消息服务报警，请检查`
  }



  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      logger.error(`combo_put - sendMail failed: mailsOptions: ${JSON.stringify(mailOptions)}, error message: ${JSON.stringify(error.error_msg ? error : error.stack)}`)
    } else {
      logger.info('combo_put - 发送邮件成功')
    }
  })
}

sendMail()