const {
  convertCategory,
  buildChildren,
  convertQueryToWhere,
  convertQueryToSort
} = require('./converter');
const { createSyncCategories } = require('@commercetools/sync-actions');

module.exports = fastify => {
  const service = require('./service')(fastify);

  const getBySlug = async (request, reply) => {
    const { locale, getChildren } = request.query;
    const { slug } = request.params;
    let children = [];

    const category = await service.getBySlug({
      queryArgs: {
        where: [`slug(${locale}="${slug}")`],
        expand: ['ancestors[*]'],
        limit: 1,
        page: 1
      }
    });

    if (getChildren && category) {
      children = await getChildrenById(
        category.results[0].id,
        category.results[0].ancestors.length + 1
      );
    }

    return category
      ? reply.send(convertCategory({ ...category.results[0], children }))
      : reply.callNotFound();
  };

  const getById = async (request, reply) => {
    const { id } = request.params;
    const { getChildren } = request.query;
    let children = [];

    const category = await service.getById(id, { queryArgs: { getChildren } });

    if (getChildren && category) {
      children = await getChildrenById(
        category.id,
        category.ancestors.length + 1
      );
    }

    return category
      ? reply.code(200).send(convertCategory({ ...category, children }))
      : reply.callNotFound();
  };

  const find = async (request, reply) => {
    const {
      page,
      limit,
      sortBy,
      sortDirection,
      locale = 'en',
      isCategoryRoot,
      name,
      slug,
      getChildren
    } = request.query;

    const categories = await service.find({
      queryArgs: {
        page,
        limit,
        sort: convertQueryToSort({ sortBy, sortDirection }),
        expand: ['ancestors[*]'],
        where: convertQueryToWhere({ name, slug, isCategoryRoot }, locale)
      }
    });

    const mapedCategories = {
      ...categories,
      results: await Promise.all(
        categories.results.map(async category => ({
          ...convertCategory(category),
          children: getChildren ? await getChildrenById(category.id, 1) : []
        }))
      )
    };

    return reply.code(200).send(mapedCategories);
  };

  const create = async (request, reply) => {
    const { body, query: queryArgs } = request;

    const category = await service.create({ queryArgs, body });

    return reply.code(201).send(convertCategory(category));
  };

  const update = async (request, reply) => {
    const {
      body,
      params: { id }
    } = request;

    const category = await service.getById(id);

    const syncCategories = createSyncCategories();
    const actions = syncCategories.buildActions(body, category);

    const updatedCategory = await service.update(id, {
      body: { version: category.version, actions }
    });

    return updatedCategory
      ? reply.code(200).send(convertCategory(updatedCategory))
      : reply.callNotFound();
  };

  const remove = async (request, reply) => {
    const {
      params: { id },
      query: queryArgs
    } = request;

    const { version } = await service.getById(id);

    const category = await service.remove(id, {
      queryArgs: { ...(queryArgs && { ...queryArgs }), version }
    });

    return category
      ? reply.code(200).send(convertCategory(category))
      : reply.callNotFound();
  };

  const getChildrenById = async (id, depth) => {
    const query = {
      where: [`ancestors(id="${id}")`],
      expand: ['ancestors[*]']
    };

    const categories = await service.getChildren({
      queryArgs: query
    });
    return buildChildren(categories.results.map(convertCategory), depth);
  };

  return {
    getBySlug,
    getById,
    find,
    create,
    update,
    remove
  };
};
