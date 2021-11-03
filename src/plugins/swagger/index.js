const fastifyPlugin = require('fastify-plugin');
const fastifySwagger = require('fastify-swagger');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const swaggerConfig = {
    exposeRoute: true,
    routePrefix: '/docs',
    openapi: {
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
      servers: [
        {
          url: 'http://127.0.0.1',
          description: 'Development server'
        },
        {
          url: 'http://{url}/{basePath}',
          description: 'The production API server',
          variables: {
            basePath: {
              default: '/s/fastify-microservice-template/v1'
            },
            url: {
              default: '127.0.0.1'
            }
          }
        }
      ],
      tags: [{ name: 'public' }, { name: 'private' }], // Private / Public tags refer to whether an operation needs authentication or not.
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header'
          }
        }
      },
      ...opts
    }
  };

  fastify.register(fastifySwagger, swaggerConfig);

  next();
});
