/**
 * XadillaX <i@2333.moe> created at 2017-02-27 11:03:08 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

const subscriber = require('../lib/rabbitmq/sub');
subscriber.start(function() {
    console.log('Consumer started.');
});
