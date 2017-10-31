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
import JPushNotification from '../../models/jpushNotification'
const publisher = require('../../lib/rabbitmq/producer')

const logger = log4js.getLogger('sms')
const jpushNotification: Router = Router();

jpushNotification.post('/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('jpushNotification:post:', req.body)
            let code = Math.floor(100000 + Math.random() * 900000)
            let result = await JPushNotification.forge({
                notificationId: req.body.id,//TODO:这里的forge方法是什么鬼,这个obj的属性可以随意定义吗？
                code: code,
                createtime: new Date()
            }).save()
            let message = req.body;
            logger.info('jpushNotification:post:message', message)
            publisher.publish(message, require('config').queue.consumerAdapters[2].queueName, function () {
                res.send(result)
            })
        } catch (error) {
            logger.error('jpushNotification:post:error', error)
            res.status(500).send(error)
        }
    }
)

jpushNotification.post('/verification',
    async (req: Request, res: Response, next: NextFunction) => {
        res.send('jpush notification verified ok')
    }
)

export { jpushNotification }
