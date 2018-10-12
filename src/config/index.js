import fastifyPlugin from 'fastify-plugin';
import fastifyEnv from 'fastify-env';

const schema = {
  type: 'object',
  required: [
    'PORT',
    'commercetools_clientId',
    'commercetools_clientSecret',
    'commercetools_host',
    'commercetools_oauthHost',
    'commercetools_projectKey'
  ],
  properties: {
    PORT: { type: 'string', default: 3000 },
    commercetools_clientId: { type: 'string' },
    commercetools_clientSecret: { type: 'string' },
    commercetools_host: {
      type: 'string',
      default: 'https://api.commercetools.co'
    },
    commercetools_oauthHost: {
      type: 'string',
      default: 'https://auth.commercetools.co'
    },
    commercetools_projectKey: { type: 'string' }
  }
};

const configPlugin = async (fastify, options) => {
  fastify.register(fastifyEnv, { schema });
};

export default fastifyPlugin(configPlugin);
