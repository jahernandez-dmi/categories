/* eslint-disable no-console */
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts, next) => {
  fastify.addHook('onRequest', (req, res, done) => {
    const { 'jwt-base-64': jwtBase64 } = req.headers;
    if (!jwtBase64) {
      done();
    } else {
      const jwtData = JSON.parse(Buffer.from(jwtBase64, 'base64').toString());

      const { isAnonymous, customerId, anonymousId } = jwtData;

      req.auth = {
        customerId: customerId,
        anonymousId: anonymousId,
        isAnonymous
      };
      done();
    }
  });

  next();
});
