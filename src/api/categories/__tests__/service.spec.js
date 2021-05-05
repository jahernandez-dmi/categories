const Service = require('../service');
jest.mock('@commercetools/sync-actions', () => ({
  createSyncCategories: () => ({ buildActions: jest.fn() })
}));

const buildService = repositories =>
  Service({ commercetools: { repositories } });

describe('Category service', () => {
  let service;
  let response;

  describe('Get category by slug', () => {
    describe('when category exits', () => {
      const CategoryRepository = {
        find: jest.fn().mockResolvedValue({ results: [{ id: 'category-id1' }] })
      };
      let commercetools = {
        repositories: {
          CategoryRepository
        }
      };

      beforeEach(async () => {
        service = require('../service')({ commercetools });
        response = await service.getBySlug({ slug: 'slug-1' });
      });

      test('should call to CategoryRepository find method', () => {
        expect(CategoryRepository.find).toHaveBeenCalledWith({
          where: [`slug(en-US="slug-1")`],
          expand: ['ancestors[*]'],
          perPage: 1,
          page: 1
        });
      });

      test('should return the category', () => {
        expect(response).toEqual({
          id: 'category-id1'
        });
      });
    });

    describe('when category does not exit', () => {
      const CategoryRepository = {
        find: jest.fn().mockResolvedValue({ results: [] })
      };

      beforeEach(async () => {
        response = await buildService({ CategoryRepository }).getBySlug({
          slug: 'slug-2'
        });
      });

      test('should call to CategoryRepository find method', () => {
        expect(CategoryRepository.find).toHaveBeenCalledWith({
          where: [`slug(en-US="slug-2")`],
          expand: ['ancestors[*]'],
          perPage: 1,
          page: 1
        });
      });

      test('should return undefined', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('Get category by id', () => {
    const CategoryRepository = {
      get: jest.fn()
    };

    beforeEach(async () => {
      response = await buildService({ CategoryRepository }).getById('foo');
    });

    test('should call CategoryRepository get method', () => {
      expect(CategoryRepository.get).toHaveBeenCalledWith('foo');
    });
  });

  describe('Find categories', () => {
    const CategoryRepository = {
      find: jest.fn()
    };
    const args = {
      page: 1,
      perPage: 2,
      sortBy: 'foo',
      sortDirection: 'asc'
    };

    beforeEach(async () => {
      await buildService({ CategoryRepository }).find(args);
    });

    test('should call CategoryRepository find method', () => {
      expect(CategoryRepository.find).toHaveBeenCalledWith({
        ...args,
        expand: ['ancestors[*]'],
        where: []
      });
    });
  });

  describe('Create category', () => {
    const CategoryRepository = {
      create: jest.fn()
    };
    const categoryDraft = {
      name: {
        'de-DE': 'foo'
      }
    };

    beforeEach(async () => {
      await buildService({ CategoryRepository }).create(categoryDraft);
    });

    test('should call CategoryRepository create method', () => {
      expect(CategoryRepository.create).toHaveBeenCalledWith(categoryDraft);
    });
  });

  describe('Remove category', () => {
    const CategoryRepository = {
      delete: jest.fn(),
      get: jest.fn().mockResolvedValue({ version: 1 })
    };

    beforeEach(async () => {
      await buildService({ CategoryRepository }).remove('foo');
    });

    test('should call CategoryRepository delete method', () => {
      expect(CategoryRepository.delete).toHaveBeenCalledWith('foo', 1);
    });
  });

  describe('Update category', () => {
    const CategoryRepository = {
      update: jest.fn(),
      get: jest.fn().mockResolvedValue({ version: 1 })
    };
    const categoryDraft = {
      name: {
        'de-DE': 'foo'
      }
    };

    beforeEach(async () => {
      await buildService({ CategoryRepository }).update('foo', categoryDraft);
    });

    test('should call CategoryRepository update method', () => {
      expect(CategoryRepository.update).toHaveBeenCalledWith(
        'foo',
        1,
        undefined
      );
    });
  });

  describe('getChildren', () => {
    const CategoryRepository = {
      findAll: jest.fn().mockResolvedValue({ results: [] })
    };

    beforeEach(async () => {
      await buildService({ CategoryRepository }).getChildren('foo');
    });

    test('should call CategoryRepository findAll method', () => {
      expect(CategoryRepository.findAll).toHaveBeenCalledWith({
        where: [`ancestors(id="foo")`],
        expand: ['ancestors[*]']
      });
    });
  });
});
