const schema = require('./categories/schema');
const injectJwtAuth = require('../plugins/inject-jwt-auth');

module.exports = async fastify => {
  fastify.register(injectJwtAuth);

  const controller = require('./categories/controller')(fastify);

  fastify.route({
    method: 'GET',
    url: '/slug/:slug',
    schema: schema.getBySlugSchema,
    handler: controller.getBySlug
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: schema.getByIdSchema,
    handler: controller.getById
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: schema.findSchema,
    handler: controller.find
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: schema.createSchema,
    handler: controller.create
  });

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: schema.updateSchema,
    handler: controller.update
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: schema.removeSchema,
    handler: controller.remove
  });
};
