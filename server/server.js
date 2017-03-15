'use strict';

const fs = require('fs');
const path = require('path');

const boot = require('loopback-boot');
const config = require('config');
const loopback = require('loopback');

const app = module.exports = loopback();

// prepare configuration
fs.writeFileSync(
    path.resolve(__dirname, 'config.json'),
    JSON.stringify(config.server, true, 2),
    { encoding: 'utf8' });
fs.writeFileSync(
    path.resolve(__dirname, 'datasources.json'),
    JSON.stringify(config.datasources, true, 2),
    { encoding: 'utf8' });
fs.writeFileSync(
    path.resolve(__dirname, 'middleware.json'),
    JSON.stringify(config.middleware, true, 2),
    { encoding: 'utf8' });
fs.writeFileSync(
    path.resolve(__dirname, 'component-config.json'),
    JSON.stringify(config.component, true, 2),
    { encoding: 'utf8' });

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        const baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if(app.get('loopback-component-explorer')) {
            const explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if(err) throw err;

    // start the server if `$ node server.js`
    if(require.main === module) app.start();
});
