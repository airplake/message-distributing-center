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
const publisher = require('../../lib/rabbitmq/producer')
const smsTemplate = require('config').smsTemplate
import { AliyunSms } from '../../utils'
const config = require('config')
import * as moment from 'moment'


const logger = log4js.getLogger('sms')
const sms: Router = Router();

sms.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('sms:post:', req.body)


            let result = await Sms.query({ where: { 'phone': req.body.phone } }).orderBy('id', 'DESC').fetch()
            let code = undefined
            // 
            if (result) {
                // console.log('createtime',moment(result.get('createtime')))
                // console.log('new', moment(new Date()))
                // console.log(moment(new Date()).diff(moment(result.get('createtime')), 'minutes'))
                if (moment(new Date()).diff(moment(result.get('createtime')), 'minutes') > 3) {
                    // console.log('3')
                    code = Math.floor(100000 + Math.random() * 900000)
                    result = await Sms.forge({
                        phone: req.body.phone,
                        code: code,
                        createtime: new Date()
                    }).save()
                }
                else {
                    // console.log('4')
                    code = result.get('code')
                }

            }

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


            await new AliyunSms(config.get('smsAliyun')).sendRegistSms(message.message)

            res.send(result)
        } catch (error) {
            error.Phone = req.body.tel
            logger.error('sms:post:error', error)
            res.status(500).send(error)
        }
    }
)

sms.post('/verification',
    async (req: Request, res: Response, next: NextFunction) => {
        res.send('ok')
    }
)

export { sms }
