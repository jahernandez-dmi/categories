const { convertCategory } = require('./converter');

module.exports = fastify => {
  const service = require('./service')(fastify);

  const getBySlug = async (request, reply) => {
    const { locale, getChildren } = request.query;
    const { slug } = request.params;
    let children = [];

    const category = await service.getBySlug({
      locale,
      slug
    });

    if (getChildren && category)
      children = await service.getChildren(
        category.id,
        category.ancestors.length + 1
      );

    return category
      ? reply.send(convertCategory({ ...category, children }))
      : reply.callNotFound();
  };

  const getById = async (request, reply) => {
    const { id } = request.params;
    const { getChildren } = request.query;
    let children = [];

    const category = await service.getById(id);

    if (getChildren && category)
      children = await service.getChildren(
        category.id,
        category.ancestors.length + 1
      );

    return category
      ? reply.code(200).send(convertCategory({ ...category, children }))
      : reply.callNotFound();
  };

  const find = async (request, reply) => {
    const {
      page,
      perPage,
      sortBy,
      sortDirection,
      locale,
      isCategoryRoot,
      name,
      slug,
      getChildren
    } = request.query;

    const categories = await service.find({
      page,
      perPage,
      sortBy,
      sortDirection,
      locale,
      isCategoryRoot,
      name,
      slug
    });
    const mapedCategories = {
      ...categories,
      results: await Promise.all(
        categories.results.map(async category => ({
          ...convertCategory(category),
          children: getChildren ? await service.getChildren(category.id, 1) : []
        }))
      )
    };

    return reply.code(200).send(mapedCategories);
  };

  const create = async (request, reply) => {
    const { body } = request;

    const category = await service.create(body);

    return reply.code(201).send(convertCategory(category));
  };

  const update = async (request, reply) => {
    const {
      body,
      params: { id }
    } = request;

    const category = await service.update(id, body);

    return category
      ? reply.code(200).send(convertCategory(category))
      : reply.callNotFound();
  };

  const remove = async (request, reply) => {
    const { id } = request.params;

    const category = await service.remove(id);

    return category
      ? reply.code(200).send(convertCategory(category))
      : reply.callNotFound();
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
