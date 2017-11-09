/**
 * Filename: g:\project\airplake\mdc-v4\src\modules\sms\sms.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 10:33:24 am
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */

import * as log4js from 'log4js'
import * as joi from 'joi'
import { Router, Request, Response, NextFunction } from 'express';
import JPushNotification from '../../models/jpushNotification'
import { ValidateMiddleware as queryValidator } from '../../middlewares'

const publisher = require('../../lib/rabbitmq/producer')

const logger = log4js.getLogger('jpush')
const jpushNotification: Router = Router();

jpushNotification.post('/',
    queryValidator({
        body: joi.object().keys({
            audience:joi.alternatives([
                joi.string().required(),
                joi.array().required()
            ]),
            title: joi.string(),
            content: joi.string().required(),
            android: joi.object(),
            ios: joi.object(),
            options: joi.object(),
            extra: joi.object()
        })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info('jpushNotification:post:', req.body)
            let body = req.body
            let result = await JPushNotification.forge({
                audience: body.audience.toString(), // 要发送目标:all || ios || android || "[$jpush_regId1, $jpush_regId2,...]"//必填
                title: body.title, // 通知标题 , 可选
                content: body.content, // 通知的具体内容 //必填
                android: body.android || '',
                ios: body.ios || '',
                options: body.options || '',
                extra: body.extra || '', // 额外的信息，json格式 可选
            }).save()

            let message = req.body
            message.id = result.id

            logger.info('jpushNotification:post:message', message)
            publisher.publish({ message }, require('config').queue.consumerAdapters[3].queueName, function () {
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
