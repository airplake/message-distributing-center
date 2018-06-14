const consumer = require('../lib/rabbitmq/worker')
import * as config from "config";
const log4js = require('log4js')
// const config = require('config')

// log config
log4js.layouts.addLayout('json', function (config) {
  return function (logEvent) { return JSON.stringify(logEvent) + config.separator }
})


log4js.configure(config.get("log"));
const logger = log4js.getLogger("consumer");

logger.info('config',config)
logger.info('start')

consumer.start(function (err:Error) {
  if(err) return  console.log(`rabbitmq error`,err);
  console.log('Consumer started.')
})
