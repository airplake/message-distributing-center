const publisher = require('../lib/rabbitmq/producer')


const mqSend = (message, queName) => {
  publisher.start((err) => {
    console.log('message',message)
    console.log('queName',queName)
    
    if (err) console.log(`publish start: ${JSON.stringify(err.stack)}`)
    publisher.publish(message, queName, (error) => {
      if (error) console.log(`publisher publish: ${JSON.stringify(error.stack)}`)
      console.log('publisher publish success')
    })
  })
}

export { mqSend } 