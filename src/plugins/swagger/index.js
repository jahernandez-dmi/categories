const fastifyPlugin = require('fastify-plugin');
const fastifyOas = require('fastify-oas');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const swaggerConfig = {
    exposeRoute: true,
    routePrefix: '/docs',
    openapi: '3.1.0',
    swagger: {
      info: {
        title: 'Template Microservice',
        description: 'Template Microservice description',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          url: 'http://www.example.com/support',
          email: 'cta@devgurus.io'
        }
      },
      host: '127.0.0.1',
      basePath: '/s/fastify-microservice-template/v1',
      tags: [{ name: 'public' }, { name: 'private' }], // Private / Public tags refer to whether an operation needs authentication or not.
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      },
      ...opts
    }
  };

  fastify.register(fastifyOas, swaggerConfig);

  next();
});
