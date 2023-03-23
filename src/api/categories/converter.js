const convertCategory = ctCategory => {
  const {
    id,
    name,
    description,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    children = [],
    orderHint,
    parent,
    ancestors
  } = ctCategory;
  return {
    id,
    name,
    description,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    children,
    orderHint,
    parent:
      parent && parent.obj
        ? { name: parent.obj.name, slug: parent.obj.slug }
        : undefined,
    ancestors: ancestors.map(({ obj, id }) =>
      obj ? { name: obj.name, slug: obj.slug, id } : { id }
    )
  };
};

const convertQueryToWhere = (query, locale) => {
  const where = [];

  if (query.name) {
    where.push(`name(${locale}="${query.name}")`);
  }

  if (query.slug) {
    where.push(`slug(${locale}="${query.slug}")`);
  }

  if (typeof query.isCategoryRoot === 'boolean') {
    where.push(
      query.isCategoryRoot ? 'parent is not defined' : 'parent is defined'
    );
  }

  return where;
};

const convertQueryToSort = query => {
  const sort = [];

  if (query.sortBy && query.sortDirection) {
    sort.push(`${query.sortBy} ${query.sortDirection}`);
  }

  return sort;
};

const buildChildren = (categories, depth = 0) => {
  const parents = categories.filter(cat => cat.ancestors.length === depth);

  return parents.map(cat => ({
    ...cat,
    children: buildChildren(
      categories.filter(c => c.ancestors.find(a => a.id === cat.id)),
      depth + 1
    )
  }));
};

module.exports = {
  convertCategory,
  convertQueryToWhere,
  buildChildren,
  convertQueryToSort
};
