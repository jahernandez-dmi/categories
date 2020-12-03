jest.mock('../service');
const Service = require('../service');

const controller = require('../controller')({
  config: {}
});

describe('controller', () => {
  let request;
  let reply;
  let service;

  beforeEach(() => {
    service = Service({});

    request = {
      log: { error: () => {}, warn: () => {}, debug: () => {} },
      body: {},
      params: {},
      query: {}
    };
    reply = {
      code: jest.fn(code => {
        return {
          send: data => {
            return { statusCode: code, body: data };
          }
        };
      }),
      send: jest.fn(data => {
        return { statusCode: 200, body: data };
      })
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('methodCT', () => {
    let serviceSpy;
    let query;

    beforeAll(() => {
      query = { key: 'key1' };
    });

    beforeEach(async () => {
      serviceSpy = jest.spyOn(service, 'getProducts');

      await controller.methodCT({ ...request, query }, reply);
    });

    it('should call to service getProducts method', () => {
      expect(serviceSpy).toHaveBeenCalledWith(query);
    });

    it('should return code 200', () => {
      expect(reply.code).toHaveBeenCalledWith(200);
    });
  });
});
