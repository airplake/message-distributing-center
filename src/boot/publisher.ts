/**
 * Filename: g:\project\airplake\mdc-v4\src\boot\publisher.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 12:31:53 pm
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */

const start = (callback:Function,retry:number = 0) =>{
    const publisher = require('../lib/rabbitmq/producer')
    // console.log('Connecting to RabbitMQ...')
    //let retry = 5 
    publisher.start(function (err:Error) {
      //if (err) return callback(err)

      while (err) {
        if(retry<5){
          retry ++
          console.log('retry',retry)
          return start(callback,retry)
        }
        return callback(err)
      }


      console.log('Connecting to RabbitMQ...')
      callback()
    })
  }
  export  { start }