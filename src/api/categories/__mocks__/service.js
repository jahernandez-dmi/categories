const service = jest.genMockFromModule('../service');

const category = {
  id: 'category-1',
  version: 1,
  name: {
    'en-US': '60s Knit Fashion Dresses'
  },
  slug: {
    'en-US': '60s_knit_fashion_dresses'
  },
  description: {
    'en-US': ''
  },
  metaTitle: {
    'en-US': ''
  },
  metaDescription: {
    'en-US': ''
  },
  metaKeywords: {
    'en-US': ''
  },
  ancestors: []
};

module.exports = () => {
  service.getBySlug = ({ slug }) =>
    slug === 'not-exits' ? undefined : category;

  service.getById = id => (id === 'not-exist' ? undefined : category);

  service.find = () => ({ results: [category] });

  service.create = () => category;

  service.remove = id => (id === 'not-exist' ? undefined : category);

  service.update = id => (id === 'not-exist' ? undefined : category);

  service.getChildren = () => ['children'];

  return service;
};
