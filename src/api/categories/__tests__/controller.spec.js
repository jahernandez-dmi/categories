jest.mock('../service');
const controller = require('../controller')({ commercetools: {} });
const service = require('../service')();

const { createReplyMock } = require('../../../utils/test-utils');

const category = {
  id: 'category-1',
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

describe('Category controller', () => {
  let request;
  let response;
  let spy;
  let reply;

  beforeEach(() => {
    reply = createReplyMock();
  });

  describe('getBySlug', () => {
    describe('when category exists', () => {
      beforeEach(async () => {
        request = {
          params: { slug: 'category-slug1' },
          query: { locale: 'en-US', getChildren: true }
        };
        spy = jest.spyOn(service, 'getBySlug');

        response = await controller.getBySlug(request, reply);
      });

      test('should call to getBySlug service method', () => {
        expect(spy).toHaveBeenCalledWith({
          locale: 'en-US',
          slug: 'category-slug1'
        });
      });

      test('should return the category', () => {
        expect(response.body).toEqual({ ...category, children: ['children'] });
      });

      test('should call to reply send method', () => {
        expect(reply.send).toHaveBeenCalledWith({
          ...category,
          children: ['children']
        });
      });
    });
    describe('when category does not exist', () => {
      beforeEach(async () => {
        request = {
          params: { slug: 'not-exits' },
          query: { locale: 'en-US' }
        };
        spy = jest.spyOn(service, 'getBySlug');

        response = await controller.getBySlug(request, reply);
      });

      test('should call to getBySlug service method', () => {
        expect(spy).toHaveBeenCalledWith({
          locale: 'en-US',
          slug: 'not-exits'
        });
      });

      test('should not call to reply send method', () => {
        expect(reply.send).not.toHaveBeenCalled();
      });

      test('should  call to reply callNotFound method', () => {
        expect(reply.callNotFound).toHaveBeenCalled();
      });
    });
  });

  describe('getById', () => {
    describe('when category exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'foo'
          },
          query: {
            getChildren: true
          }
        };
        spy = jest.spyOn(service, 'getById');
        await controller.getById(request, reply);
      });

      test('should call to getById service method', () => {
        expect(spy).toHaveBeenCalledWith('foo');
      });

      test('should call reply.code method', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });

      test('should call reply.code.send', () => {
        expect(reply.send).toHaveBeenCalled();
      });
    });

    describe('when category does not exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'not-exist'
          },
          query: {}
        };
        await controller.getById(request, reply);
      });

      test('should call reply callNotFound', () => {
        expect(reply.callNotFound).toHaveBeenCalled();
      });
    });
  });

  describe('find', () => {
    describe('without getChildren queryParam', () => {
      beforeEach(async () => {
        request = {
          query: {
            page: 1,
            perPage: 2,
            sortBy: 'foo',
            sortDirection: 'asc'
          }
        };
        spy = jest.spyOn(service, 'find');
        await controller.find(request, reply);
      });

      test('should call to getById service method', () => {
        expect(spy).toHaveBeenCalledWith({
          page: 1,
          perPage: 2,
          sortBy: 'foo',
          sortDirection: 'asc'
        });
      });

      test('should call reply.code method', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });

      test('should call reply.code.send', () => {
        expect(reply.send).toHaveBeenCalled();
      });
    });

    describe('with getChildren queryParam', () => {
      beforeEach(async () => {
        request = {
          query: {
            page: 1,
            perPage: 2,
            sortBy: 'foo',
            sortDirection: 'asc',
            getChildren: true
          }
        };
        spy = jest.spyOn(service, 'getChildren');
        await controller.find(request, reply);
      });
      test('should call service.getChildren', () => {
        expect(spy).toHaveBeenCalledWith('category-1', 1);
      });
    });
  });

  describe('create', () => {
    beforeEach(async () => {
      request = {
        body: {
          name: {
            'de-DE': 'foo'
          }
        }
      };
      spy = jest.spyOn(service, 'create');
      await controller.create(request, reply);
    });

    test('should call to create service method', () => {
      expect(spy).toHaveBeenCalledWith({
        name: {
          'de-DE': 'foo'
        }
      });
    });

    test('should call reply.code method', () => {
      expect(reply.code).toHaveBeenCalledWith(201);
    });

    test('should call reply.code.send', () => {
      expect(reply.send).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    describe('category exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'foo'
          }
        };
        spy = jest.spyOn(service, 'remove');
        await controller.remove(request, reply);
      });

      test('should call to create service method', () => {
        expect(spy).toHaveBeenCalledWith('foo');
      });

      test('should call reply.code method', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });

      test('should call reply.code.send', () => {
        expect(reply.send).toHaveBeenCalled();
      });
    });

    describe('category doesnt exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'not-exist'
          }
        };
        spy = jest.spyOn(service, 'remove');
        await controller.remove(request, reply);
      });

      test('should call reply callNotFound', () => {
        expect(reply.callNotFound).toHaveBeenCalled();
      });
    });
  });

  describe('update', () => {
    describe('category exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'foo'
          },
          body: {
            bar: 'foo'
          }
        };
        spy = jest.spyOn(service, 'update');
        await controller.update(request, reply);
      });

      test('should call to update service method', () => {
        expect(spy).toHaveBeenCalledWith('foo', { bar: 'foo' });
      });

      test('should call reply.code method', () => {
        expect(reply.code).toHaveBeenCalledWith(200);
      });

      test('should call reply.code.send', () => {
        expect(reply.send).toHaveBeenCalled();
      });
    });

    describe('category doesnt exist', () => {
      beforeEach(async () => {
        request = {
          params: {
            id: 'not-exist'
          },
          body: {
            bar: 'foo'
          }
        };
        spy = jest.spyOn(service, 'update');
        await controller.update(request, reply);
      });

      test('should call reply callNotFound', () => {
        expect(reply.callNotFound).toHaveBeenCalled();
      });
    });
  });
});
