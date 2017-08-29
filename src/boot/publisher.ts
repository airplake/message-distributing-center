/**
 * Filename: g:\project\airplake\mdc-v4\src\boot\publisher.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 12:31:53 pm
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */

const start = (callback:Function) =>{
    const publisher = require('../lib/rabbitmq/producer')
    // console.log('Connecting to RabbitMQ...')
    publisher.start(function (err:Error) {
      if (err) return callback(err)
      console.log('Connecting to RabbitMQ...')
      callback()
    })
  }
  export  { start }