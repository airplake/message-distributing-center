


function test (req, res ) {
  // body...
  res.apiSuccess("ok");
}

module.exports.register = function (router) {
  router.get('/', test);
  return '/test';
};
