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

            // if(!req.body.message){
            //     req.body.message = {
            //         name : ''
            //     }
            // }

    

            let message = {
                message: {
                    PhoneNumbers: req.body.tel, // 要发送到短信的手机
                    SignName: smsTemplate[req.body.templateid].SignName, // 短信签名，阿里云短信平台申请
                    TemplateCode: smsTemplate[req.body.templateid].TemplateCode, // 短信模板Code，阿里云短信平台申请
                    TemplateParam: req.body.message ? Object.assign({"name":(req.body.message.name || req.body.message)}, req.body.message) : undefined,
                    OutId: ''// 可选
                }
            }
            
            // delete TemplateParam
            if (!req.body.message){
                delete message.message.TemplateParam
            }

            logger.info('template:post:message', message)
            publisher.publish(message, require('config').queue.consumerAdapters[2].queueName, function () {
               // res.send(result)
            })
            res.send(result)
        } catch (error) {
            logger.error('template:post:error', error)
            res.status(500).send(error)
        }
    }
)


Object.assign({"name":111}, 11)

export { template }
