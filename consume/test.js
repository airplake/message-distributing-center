/**
 * XadillaX <i@2333.moe> created at 2017-02-27 11:16:08 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

class Test extends require('events').EventEmitter {
    constructor() {
        super();

        this.on('message', function(message, ack) {
            console.log(message);
            ack.acknowledge();
        });
    }
}

exports.create = function() {
    return new Test();
};
