/* eslint-disable no-console */
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, opts, next) => {
  fastify.addHook('onRequest', (req, res, done) => {
    const { 'jwt-base-64': jwtBase64 } = req.headers;

    const jwtData = JSON.parse(Buffer.from(jwtBase64, 'base64').toString());

    const { isAnonymous, sub } = jwtData;

    req.auth = {
      customerId: !isAnonymous ? sub : undefined,
      anonymousId: isAnonymous ? sub : undefined,
      isAnonymous: isAnonymous
    };

    done();
  });

  next();
});
