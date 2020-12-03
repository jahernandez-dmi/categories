const fastifyPlugin = require('fastify-plugin');
const fastifyOas = require('fastify-oas');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const swaggerConfig = {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Template Microservice',
        description: 'Template Microservice description',
        version: '1.0.0'
      },
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
