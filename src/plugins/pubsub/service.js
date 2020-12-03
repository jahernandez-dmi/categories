const { PubSub } = require('@google-cloud/pubsub');

class PubSubService {
  /**
   *
   * @param {ClientConfig} clientConfig PubSub options
   * @param {object} options service options such as logger
   */
  constructor(clientConfig = {}, options = {}) {
    this.client = new PubSub(clientConfig);
    this.logger = options.logger || console;
  }

  /**
   *
   * @param {object} event google function event with data in base64 and an attributes object
   */
  readMessage(event) {
    const isStringified =
      event.attributes && event.attributes.stringified === 'true';
    return {
      data: isStringified
        ? JSON.parse(Buffer.from(event.data, 'base64').toString())
        : Buffer.from(event.data, 'base64').toString(),
      attributes: event.attributes || {}
    };
  }

  /**
   *
   * @param {any} data Data to send.
   * @param {object} attributes Object of attributes to send (optional)
   */
  buildMessage(data, attributes = {}) {
    return {
      data: Buffer.from(JSON.stringify(data)),
      attributes: { ...attributes, stringified: 'true' }
    };
  }

  /**
   *
   * @param {string} topicName Topic where send the message.
   * @param {object} message Message to send. data: Data to send, attributes Object of attributes to send
   */
  async publish(topicName, data, attributes) {
    const message = this.buildMessage(data, attributes);
    try {
      return this.client
        .topic(topicName)
        .publish(message.data, message.attributes);
    } catch (err) {
      this.logger.error(
        `Error publishing {data: ${data}, attributes: ${attributes}} in topic ${topicName}.`
      );
      throw err;
    }
  }
}

module.exports = PubSubService;
