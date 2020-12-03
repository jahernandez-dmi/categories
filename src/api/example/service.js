module.exports = fastify => {
  const { ProductProjectionRepository } = fastify.commercetools.repositories;

  const service = {};

  service.getProducts = async query => {
    return ProductProjectionRepository.find(query);
  };
  return service;
};
