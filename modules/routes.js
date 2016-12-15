'use strict';

var path = require('path');

var glob = require('glob');
var _ = require('lodash');
const routerOptions = {
  mergeParams: true
};

var defines = glob.sync('modules/*/controller.js');
defines = _.union(defines, glob.sync('modules/*/controllers/*.js'));
function register(app) {
  defines.forEach(function (define) {
    const router = require('express').Router(routerOptions);
    var prefix = require(path.resolve(define)).register(router); // eslint-disable-line global-require
    app.use(prefix, router);
  });
};

module.exports.register = register;
