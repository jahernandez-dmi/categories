const schema = require('./example/schema');

module.exports = async fastify => {
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
