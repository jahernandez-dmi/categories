const fastifyPlugin = require('fastify-plugin');
const fastifyOas = require('fastify-oas');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const swaggerConfig = {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Categories Microservice',
        description: 'Categories Microservice description',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          url: 'http://www.example.com/support',
          email: 'cta@devgurus.io'
        }
      },
      host: '127.0.0.1',
      basePath: '/s/customers/v1',
      tags: [{ name: 'public' }, { name: 'private' }], // Private / Public tags refer to whether an operation needs authentication or not.
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      },
      ...opts
    }
  };

  fastify.register(fastifyOas, swaggerConfig);

  next();
});
