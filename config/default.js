'use strict';

module.exports = {
  log: {
    appenders: [ // 日志
      {
        type: 'console'
      }, // 控制台输出
      {
        type: 'file',
        filename: 'log/http.log',
        maxLogSize: 20480,
        backups: 3,
        category: 'http'
      },
      {
        type: 'file',
        filename: 'log/init.log',
        maxLogSize: 20480,
        backups: 3,
        category: 'init'
      },
      {
        type: 'file',
        filename: 'log/test.log',
        maxLogSize: 20480,
        backups: 3,
        category: 'test'
      }
    ]
  }
};
