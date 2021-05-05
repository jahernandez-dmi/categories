const { createSyncCategories } = require('@commercetools/sync-actions');
const {
  convertQueryToWhere,
  buildChildren,
  convertCategory
} = require('./converter');

module.exports = fastify => {
  const { CategoryRepository } = fastify.commercetools.repositories;

  const service = {};

  service.getChildren = async (id, depth) => {
    const query = {
      where: [`ancestors(id="${id}")`],
      expand: ['ancestors[*]']
    };

    const categories = await CategoryRepository.findAll(query);
    return buildChildren(categories.results.map(convertCategory), depth);
  };

  service.getBySlug = async ({ locale = 'en-US', slug }) => {
    const query = {
      where: [`slug(${locale}="${slug}")`],
      expand: ['ancestors[*]'],
      perPage: 1,
      page: 1
    };

    const {
      results: [category]
    } = await CategoryRepository.find(query);

    return category;
  };

  service.getById = async id => CategoryRepository.get(id);

  service.find = ({
    page,
    perPage,
    sortBy,
    sortDirection,
    locale = 'en',
    isCategoryRoot,
    name,
    slug
  }) =>
    CategoryRepository.find({
      page,
      perPage,
      sortBy,
      sortDirection,
      expand: ['ancestors[*]'],
      where: convertQueryToWhere({ name, slug, isCategoryRoot }, locale)
    });

  service.create = categoryDraft => CategoryRepository.create(categoryDraft);

  service.update = async (id, categoryDraft) => {
    const category = await service.getById(id);

    const syncCategories = createSyncCategories();
    const actions = syncCategories.buildActions(categoryDraft, category);

    return CategoryRepository.update(id, category.version, actions);
  };

  service.remove = async id => {
    const category = await service.getById(id);

    await CategoryRepository.delete(id, category.version);

    return category;
  };

  return service;
};
