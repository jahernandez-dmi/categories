const routes = async (fastify, options) => {
  fastify.get('/', async (request, reply) => {
    const requestBuilder = fastify.getRequestBuilder();

    return fastify.commercetools
      .execute({
        uri: requestBuilder.products.parse({}).build(),
        method: 'GET'
      })
      .then(res => res.body);
  });
};

export default routes;
