/**
 * Filename: g:\project\airplake\mdc-v4\src\modules\sms\sms.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 10:33:24 am
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */

import * as log4js from 'log4js'
import { Router, Request, Response, NextFunction } from 'express';
import Template from '../../models/template'
const publisher = require('../../lib/rabbitmq/producer')
const smsTemplate = require('config').smsTemplate

const template: Router = Router();
const logger = log4js.getLogger('sms')
import { mqSend } from '../../utils'

template.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('template:post:', req.body)
            let code = Math.floor(100000 + Math.random() * 900000)
            let result = await Template.forge({
                tel: req.body.tel,
                code: code,
                message: encodeURI(req.body.message) || '',
                templateid: req.body.templateid,
                createtime: new Date()
            }).save()

            let message = {
                message: {
                    PhoneNumbers: req.body.tel, // 要发送到短信的手机
                    SignName: smsTemplate[req.body.templateid].SignName, // 短信签名，阿里云短信平台申请
                    TemplateCode: smsTemplate[req.body.templateid].TemplateCode, // 短信模板Code，阿里云短信平台申请
                    TemplateParam:undefined,            
                    OutId: ''// 可选
                }
            }

            if(!req.body.message || req.body.message === ''){
                delete message.message.TemplateParam
            }
            else{
                if(typeof req.body.message === 'object'){
                   //  message.message.TemplateParam  = JSON.stringify(req.body.message)

                //    for (const key in req.body.message) {
                //        if (req.body.message.hasOwnProperty(key)) {
                //            const element = req.body.message[key];
                //            if(element.length > 6){
                //             req.body.message[key] = element.substring(0,3) + '...'
                //            }
                //        }
                //    }

                   message.message.TemplateParam  = JSON.stringify(req.body.message)
                }
                if(typeof req.body.message === 'string'){
                    message.message.TemplateParam  = JSON.stringify({"name":req.body.message})


                    // if(req.body.message.length > 6){
                    //     message.message.TemplateParam  = JSON.stringify({"name":(req.body.message.substring(0,3) + '...')})
                    // }else{
                    //     message.message.TemplateParam  = JSON.stringify({"name":req.body.message})
                    // }
                   
                }
                
            }
        
            logger.info('template:post:message', message)
            //
            // publisher.publish(message , require('config').queue.consumerAdapters[2].queueName, function () {

            // })

            console.log('message type', typeof message.message)

            mqSend(message, require('config').queue.consumerAdapters[2].queueName)



            res.send(result)
        } catch (error) {
            logger.error('template:post:error', error)
            res.status(500).send(error)
        }
    }
)


export { template }
