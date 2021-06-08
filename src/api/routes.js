const schema = require('./example/schema');
//UNCOMMENT IF JWT AUTH IS REQUIRED
//const injectJwtAuth = require('../plugins/inject-jwt-auth');

module.exports = async fastify => {
  //UNCOMMENT IF JWT AUTH IS REQUIRED
  //fastify.register(injectJwtAuth);

  const controller = require('./example/controller')(fastify);

  fastify.route({
    method: 'GET',
    url: '/',
    schema: schema.methodSchema,
    handler: controller.method
  });

  fastify.route({
    method: 'GET',
    url: '/products',
    schema: schema.methodCTSchema,
    handler: controller.methodCT
  });
};
