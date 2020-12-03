const service = jest.genMockFromModule('../service');

module.exports = () => {
  service.getProducts = jest.fn().mockResolvedValue({ results: [] });

  return service;
};
