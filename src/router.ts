/**
 * Filename: g:\project\airplake\mdc-v4\src\router.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 11:08:16 am
 * Author: Wy
 *
 * Copyright (c) 2017 Your Company
 */

import { Router } from "express";
import { sms } from "./modules/sms";
import { jpushNotification } from "./modules/jpushNotification";
import { template } from "./modules/template";
import { wechat } from "./modules/wechat";

const router: Router = Router();

router.use("/sms", sms);
router.use("/jpushNotification", jpushNotification);
router.use("/wechats", wechat);
router.use("/smsByTemplate", template);

export default router;
