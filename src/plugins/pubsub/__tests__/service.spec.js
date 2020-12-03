const Service = require('../service');
const PubSubService = new Service();

const buildEvent = (data, attributes = {}) => {
  return {
    attributes,
    data: attributes.stringified
      ? Buffer.from(JSON.stringify(data)).toString('base64')
      : Buffer.from(data).toString('base64')
  };
};

describe('PubSub service', () => {
  describe('readMessage', () => {
    it('Should read data field from a base64 encoded buffer and return an object with this data and an attribues object', () => {
      const originalData = 'Hello world!';
      const event = buildEvent(originalData);
      const expectedValue = { data: originalData, attributes: {} };
      const message = PubSubService.readMessage(event);
      expect(message).toEqual(expectedValue);
    });
    it('Should parse a stringified data message if attributes contain stringified as true', () => {
      const originalData = { salutation: 'Hello', to: 'world!' };
      const event = buildEvent(originalData, { stringified: 'true' });
      const expectedValue = {
        data: originalData,
        attributes: { stringified: 'true' }
      };
      const message = PubSubService.readMessage(event);
      expect(message).toEqual(expectedValue);
    });
  });

  describe('buildMessage', () => {
    it('Should build a message storing data as a stringified buffer and attributes as an object with stringified attribute as true', () => {
      const originalData = { salutation: 'Hello', to: 'world!' };
      const expectedValue = {
        data: Buffer.from(JSON.stringify(originalData)),
        attributes: { stringified: 'true' }
      };
      const message = PubSubService.buildMessage(originalData);
      expect(message).toEqual(expectedValue);
    });
  });

  describe('publish', () => {
    let publishFn;
    let topicFn = jest.fn(() => ({ publish: publishFn }));
    let clientMock = { topic: topicFn };
    PubSubService.client = clientMock;
    const message = { salutation: 'Hello', to: 'world!' };
    const attributes = {};

    it('Should call topic with topicName', async done => {
      publishFn = jest.fn(() => Promise.resolve());
      await PubSubService.publish('testTopic', message, attributes);
      expect(topicFn).toHaveBeenCalledWith('testTopic');
      done();
    });

    it('Should call publish with message.data and message.attributes', async done => {
      publishFn = jest.fn(() => Promise.resolve());
      await PubSubService.publish('testTopic', message);
      const msg = PubSubService.buildMessage(message, attributes);
      expect(publishFn).toHaveBeenCalledWith(msg.data, msg.attributes);
      done();
    });

    it('Should return successfully', async done => {
      publishFn = jest.fn(() => Promise.resolve());
      await PubSubService.publish('testTopic', message);
      done();
    });

    it('Should return successfully', async done => {
      publishFn = jest.fn(() => Promise.reject());
      try {
        await PubSubService.publish('testTopic', message);
      } catch (err) {
        done();
      }
    });
  });
});
