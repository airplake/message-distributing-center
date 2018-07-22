const amqp = require('amqplib')
const config = require('config')
const RABBITMQ_URL = require('config').queue.connection
// RABBITMQ_URL ||
console.log('RABBITMQ_URL',RABBITMQ_URL)
var connStr = RABBITMQ_URL

let conn
let count = 0

function connect() {
  return new Promise((resolve, reject) => {
    if (conn) return resolve(conn)
    amqp.connect(connStr).then((_conn) => {
      console.log('连接rabbitmq成功')
      // If your program runs until interrupted, you can hook into the process signal handling to close the connection:
      // process.once('SIGINT', conn.close.bind(conn))
      conn = _conn
      // 监听连接关闭事件
      conn.on('close', (err) => {

        if(count < 5 ){
          connect()
          sendMail()
          count++ 
        }


        console.log('rabbimq连接关闭')
        reject(err)
      })
      // 监听连接错误事件
      conn.on('error', (err) => {
        console.error(`rabbimq连接出错:`, err)

        if(count < 5 ){
          connect()
          sendMail()
          count++ 
        }

        reject(err)
      })
      // 监听连接阻塞事件
      conn.on('blocked', (reason) => {
        console.error(`连接阻塞，原因:${reason}`)
        reject(reason)
      })
      // 监听阻塞连接恢复正常事件
      conn.on('unblocked', () => {
        console.log('阻塞连接恢复正常')
      })
      resolve(conn)
    }).catch((err) => {
      console.error(`连接rabbitmq失败，`, err)

      if(count < 5 ){
        sendMail()
        count++ 
      }



      reject(err)
    })
  })
}

exports.createChannel = function () {
  return new Promise((resolve, reject) => {
    // if (self.ch) return resolve(self.ch);
    connect()
      .then(() => {
        return conn.createChannel()
      })
      .then((ch) => {
        // ch = this.ch
        ch.on('close', () => {
          // console.log('channel关闭');
        })
        ch.on('error', (err) => {
          console.error(`channel出错:`, err)
        })
        ch.on('return', (msg) => {
          console.log(`channel return:${msg}`)
        })
        ch.on('drain', () => {
          console.error('drain event fired.')
        })
        resolve(ch)
      })
      .catch((err) => {
        console.error(`创建channel失败，`, err)
        reject(err)
      })
  })
}


const nodemailer = require('nodemailer')
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
    to: '503945930@qq.com,xuchen@nightplus.cn,565211542@qq.com', // 收件列表
    subject: 'mdc消息服务报警,请检查', // 标题
    html: `mdc消息服务报警,请检查`
  }



  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      logger.error(`combo_put - sendMail failed: mailsOptions: ${JSON.stringify(mailOptions)}, error message: ${JSON.stringify(error.error_msg ? error : error.stack)}`)
    } else {
      logger.info('combo_put - 发送邮件成功')
    }
  })
}