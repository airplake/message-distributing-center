/**
 * XadillaX <i@2333.moe> created at 2017-03-13 11:08:38 with ❤
 *
 * Copyright (c) 2017 xcoder.in, all rights reserved.
 */
'use strict';

module.exports = {
    // refer to http://loopback.io/doc/en/lb2/config.json.html
    server: {
        restApiRoot: '/api',
        host: '0.0.0.0',
        port: 3001,
        remoting: {
            context: false,
            rest: {
                normalizeHttpPath: false,
                xml: false
            },
            json: {
                strict: false,
                limit: '100kb'
            },
            urlencoded: {
                extended: true,
                limit: '100kb'
            },
            cors: false,
            handleErrors: false
        },
        legacyExplorer: false
    },

    // refet to https://loopback.io/doc/en/lb2/component-config.json.html
    component: {
        'loopback-component-explorer': {
            mountPath: '/explorer'
        }
    },

    // refer to http://loopback.io/doc/en/lb2/datasources.json.html
    datasources: {
        db: {
            name: 'db',
            connector: 'memory'
        },
        mysql: {
            host: '',
            port: 3306,
            url: '',
            database: 'yedian-mdc',
            password: '',
            name: 'mysql',
            user: '',
            connector: 'mysql'
        }
    },

    // refer to http://loopback.io/doc/en/lb2/middleware.json.html
    middleware: {
        'initial:before': {
            'loopback#favicon': {}
        },
        initial: {
            compression: {},
            cors: {
                params: {
                    origin: true,
                    credentials: true,
                    maxAge: 86400
                }
            },
            'helmet#xssFilter': {},
            'helmet#frameguard': { params: [ 'deny' ]},
            'helmet#hsts': {
                params: {
                    maxAge: 0,
                    includeSubdomains: true
                }
            },
            'helmet#hidePoweredBy': {},
            'helmet#ieNoOpen': {},
            'helmet#noSniff': {},
            'helmet#noCache': {
                enabled: false
            }
        },
        session: {},
        auth: {},
        parse: {},
        routes: {
            'loopback#rest': { paths: [ '${restApiRoot}' ]}
        },
        files: {},
        final: {
            'loopback#urlNotFound': {}
        },
        'final:after': {
            'strong-error-handler': {}
        }
    },

    dayu: {
        sn: 'FOO',
        pwd: 'BAR'
    },

    queue: {
       // connection: 'amqp://yedian:yedian123outfox@staging-api.chinacloudapp.cn:5672',
	    connection: 'amqp://admin:admin@localhost:5672',
	    channel: 'MDC_QUEUE',
        consumerAdapters: [{
            queueName: 'email',
            require: 'mdc-email-smtp'
        },{
            queueName: 'wechat',
            require: 'mdc-weixin',
            tokenUrl: ''
        }]
    }
};
