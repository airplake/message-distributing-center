'use strict'

module.exports = function (server) {
  // Install a `/` route that returns server status
  require('dotenv').load(); // eslint-disable-line
  var router = server.loopback.Router()
  router.get('/', server.loopback.status())
  server.use(router)
}
