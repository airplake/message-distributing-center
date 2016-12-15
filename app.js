const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const log4js = require('log4js');
const dotenv = require('dotenv').config(); // eslint-disable-line
const config = require('config');
log4js.configure(config.get('log'));
const logger = log4js.getLogger('http');
logger.setLevel('INFO');
const routes = require('./modules/routes');


// 中间件，记录所有请求
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
// 接收json数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 此中间件可以模拟PUT、DELETE等http操作（express4.x中已经不再集成，如果将express升级到4.x需要安装并手动引入）
app.use(methodOverride());

// 引入自定义中间件
app.use(extendAPIOutput);

// put,delete请求时，会先发送options请求，需要给回应
app.options('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE,HEAD');
  res.status = 200;
  res.send();
});

routes.register(app);

// 所有路由都未匹配（404）
app.get('*', function (req, res, next) {
  res.sendStatus(404);
});
app.post('*', function (req, res, next) {
  res.sendStatus(404);
});
app.put('*', function (req, res, next) {
  res.sendStatus(404);
});
app.delete('*', function (req, res, next) {
  res.sendStatus(404);
});



/**
 * 给res对象添加拓展的返回方法
 */
function extendAPIOutput(req, res, next) {
    // 解决跨域问题
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-token,Accept,X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'x-token');
    // 相应api成功结果
  res.apiSuccess = (data) => {
    res.jsonp({
      status: 'OK',
      code: 200,
      data: data
    });
  };
    // 相应api出错结果，err是一个Error对象
  res.apiError = (err) => {
    res.jsonp({
      status: 'Error',
      error_code: err.err_code || 500,
      error_msg: err.error_msg || err.toString()
    });
  };
  next();
}



app.listen(config.get('app.port'), config.get('app.host'), () => {
  logger.info(`app start ${config.get('app.host')}:${config.get('app.port')}`)
})

// 导出app对象，用于单元测试
exports.app = app;
