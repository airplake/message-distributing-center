/**
 * Filename: g:\project\airplake\mdc-v4\src\modules\sms\sms.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 10:33:24 am
 * Author: Wy
 *
 * Copyright (c) 2017 Your Company
 */

import { NextFunction, Request, Response, Router } from "express";
import * as log4js from "log4js";
import Wechat from "../../models/wechat";
const publisher = require("../../lib/rabbitmq/producer");
const wechatTemplate = require("config").wechatTemplate;
import { mqSend } from '../../utils'

const logger = log4js.getLogger("wechat");
const wechat: Router = Router();

wechat.post("/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("wechat:post:", req.body);
            const result = await Wechat.forge({
                queue: "wechat",
                message: encodeURI(JSON.stringify(req.body.message)) || '',
                emit: req.body.emit,
            }).save();
            switch (req.body.emit) {
                case "sendTemplate":
                    req.body.message.templateId = wechatTemplate[req.body.message.templateId];
                    break;
                default:
                    break;
            }
            logger.info("wechat:post:message", req.body);
            // publisher.publish(req.body, require("config").queue.consumerAdapters[1].queueName, function() {
            //    // res.send(result);
            // });

            mqSend(req.body, require('config').queue.consumerAdapters[1].queueName)


            res.send(result)
        } catch (error) {
            logger.error("wechat:post:error", error);
            res.status(500).send(error);
        }
    },
);

export { wechat };
