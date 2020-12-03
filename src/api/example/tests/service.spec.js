const Service = require('../service');

const ProductProjectionRepository = {
  find: jest.fn(async () => {
    return Promise.resolve({
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [{ id: 'product1', version: 1 }]
    });
  })
};

describe('service', () => {
  let commercetools;
  let service;

  beforeAll(() => {
    commercetools = {
      repositories: {
        ProductProjectionRepository
      }
    };
    service = Service({ commercetools });
  });

  describe('getProducts', () => {
    let query;
    let response;
    beforeAll(() => {
      query = {};
    });

    beforeEach(async () => {
      response = await service.getProducts(query);
    });

    describe('when success', () => {
      test('should call ProductProjectionRepository.find with params', () => {
        expect(ProductProjectionRepository.find).toHaveBeenCalledWith(query);
      });

      test('should return response body', () => {
        expect(response).toEqual({
          limit: 20,
          offset: 0,
          count: 1,
          total: 1,
          results: [{ id: 'product1', version: 1 }]
        });
      });
    });
  });
});
