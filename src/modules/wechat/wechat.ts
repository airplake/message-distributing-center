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
import Wechat from '../../models/wechat'
import * as config from 'config'
const publisher = require('../../lib/rabbitmq/producer')
const wechatTemplate = require('config').wechatTemplate

const logger = log4js.getLogger('wechat')
const wechat: Router = Router();

wechat.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('wechat:post:', req.body)
            let result = await Wechat.forge({
                queue: 'wechat',
                message: JSON.stringify(req.body.message),
                emit: req.body.emit
            }).save()
            switch (req.body.emit) {
                case 'sendTemplate':
                    req.body.message.templateId = wechatTemplate[req.body.message.templateId]
                    break
                default:
                    break
            }
            logger.info('wechat:post:message', req.body)
            publisher.publish(req.body, 'wechat', function () {
                res.send(result)
            })
        } catch (error) {
            logger.error('wechat:post:error', error)
            res.status(500).send(error)
        }
    }
)


export { wechat }
