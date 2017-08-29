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
import Sms from '../../models/sms'
import * as config from 'config'
const publisher = require('../../lib/rabbitmq/producer')
const smsTemplate = require('config').smsTemplate

const logger = log4js.getLogger('sms')
const sms: Router = Router();

sms.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('sms:post:', req.body)
            let code = Math.floor(100000 + Math.random() * 900000)
            let result = await Sms.forge({
                phone: req.body.phone,
                code: code,
                createtime: new Date()
            }).save()
            let message = {
                message: {
                    PhoneNumbers: req.body.phone, // 要发送到短信的手机
                    SignName: smsTemplate[3].SignName, // 短信签名，阿里云短信平台申请
                    TemplateCode: smsTemplate[3].TemplateCode, // 短信模板Code，阿里云短信平台申请
                    TemplateParam: `{"code":"${code}","product":"${smsTemplate[3].SignName}"}`, // 短信模板中参数指定，以你的为准替换之
                    OutId: ''// 可选
                }
            }
            if (req.query.type === 'login') {
                message.message.TemplateCode = smsTemplate[2].TemplateCode
            }
            logger.info('sms:post:message', message)
            publisher.publish(message, 'sms-aliyun', function () {
                res.send(result)
            })
        } catch (error) {
            logger.error('sms:post:error', error)
            res.status(500).send(error)
        }
    }
)

sms.post('/verification',
    async (req: Request, res: Response, next: NextFunction) => {

    }
)

export { sms }
