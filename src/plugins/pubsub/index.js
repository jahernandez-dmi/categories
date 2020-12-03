const fp = require('fastify-plugin');
const fastifyEnv = require('fastify-env');
const PubSubService = require('./service.js');

module.exports = fp((fastify, opts, next) => {
  fastify.register(fastifyEnv, {
    schema: {
      type: 'object',
      properties: {
        GC_PROJECT_ID: {
          type: 'string',
          default: 'GCLOUD_PROJECT_ID'
        }
      }
    },
    confKey: 'pubsubconfig',
    data: opts
  });
  fastify.register(
    fp((fastify, opts, done) => {
      const clientConfig = {
        ...opts,
        projectId: fastify.pubsubconfig.PROJECT_ID
      };
      fastify.decorate(
        'pubsub',
        new PubSubService(clientConfig, { logger: fastify.log })
      );
      done();
    })
  );
  next();
});
