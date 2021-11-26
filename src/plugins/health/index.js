const fastifyHealthcheck = require('fastify-healthcheck');
const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin((fastify, opts, next) => {
  fastify.addHook('onClose', (instance, done) => {
    fastify.serviceAvailable = false;
    fastify.log.info('onClose event raised, shutting down...');
    done();
  });

  fastify.register(fastifyHealthcheck, {
    healthcheckUrl: '/live',
    logLevel: 'warn'
    // healthcheckUrlDisable: true,
    // healthcheckUrlAlwaysFail: true,
    // underPressureOptions: { } // no under-pressure specific options set here
  });

  fastify.get('/ready', { logLevel: 'warn' }, async (request, reply) => {
    reply.code(fastify.serviceAvailable ? 200 : 503).send();
  });

  next();
});
