/* eslint-disable no-empty */
module.exports = fastify => {
  const service = require('./service')(fastify);

  //eslint-disable-next-line
  const {config} = fastify;

  const method = async (request, reply) => {
    const { queryOne, queryTwo } = request.query;

    reply.code(200).send({ queryOne, queryTwo });
  };

  const methodCT = async (request, reply) => {
    const { query } = request;

    const products = await service.getProducts(query);

    reply.code(200).send(products);
  };

  return {
    method,
    methodCT
  };
};
