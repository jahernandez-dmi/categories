// const { createSyncCategories } = require('@commercetools/sync-actions');
// const { convertQueryToWhere, convertCategory } = require('./converter');

module.exports = fastify => {
  const service = {};

  const {
    commercetools: { requestBuilder }
  } = fastify;

  const categoriesRequestBuilder = requestBuilder.categories();

  service.getChildren = async methodArgs =>
    (await categoriesRequestBuilder.get(methodArgs).execute()).body;

  service.getBySlug = async methodArgs =>
    (await categoriesRequestBuilder.get(methodArgs).execute()).body;

  service.getById = async (id, methodArgs) =>
    (
      await categoriesRequestBuilder
        .withId({ ID: id })
        .get(methodArgs)
        .execute()
    ).body;

  service.find = async methodArgs =>
    (await categoriesRequestBuilder.get(methodArgs).execute()).body;

  service.create = async methodArgs =>
    (await categoriesRequestBuilder.post(methodArgs).execute()).body;

  service.update = async (id, methodArgs) =>
    (
      await categoriesRequestBuilder
        .withId({ ID: id })
        .post(methodArgs)
        .execute()
    ).body;

  service.remove = async (id, methodArgs) =>
    (
      await categoriesRequestBuilder
        .withId({ ID: id })
        .delete(methodArgs)
        .execute()
    ).body;

  return service;
};
