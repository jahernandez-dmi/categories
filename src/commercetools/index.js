import fetch from 'isomorphic-fetch';
import fastifyPlugin from 'fastify-plugin';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createLoggerMiddleware } from '@commercetools/sdk-middleware-logger';

const commerceToolsPlugin = async (fastify, options) => {
  const {
    commercetools_clientId: clientId,
    commercetools_clientSecret: clientSecret,
    commercetools_projectKey: projectKey,
    commercetools_host: host,
    commercetools_oauthHost: oauthHost,
    concurrency = 10
  } = fastify.config;

  const client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({
        host: oauthHost,
        projectKey,
        credentials: {
          clientId,
          clientSecret
        },
        fetch
      }),
      createQueueMiddleware({ concurrency }),
      createHttpMiddleware({ host }),
      createLoggerMiddleware()
    ]
  });

  const getRequestBuilder = () =>
    createRequestBuilder({ projectKey: 'neverland-dev' });

  fastify.decorate('commercetools', client);
  fastify.decorate('getRequestBuilder', getRequestBuilder);
};

export default fastifyPlugin(commerceToolsPlugin);
