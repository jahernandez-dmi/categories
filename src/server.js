import fastify from 'fastify';
import cors from 'fastify-cors';
import arecibo from 'arecibo';
import routes from './routes';
import commercetools from './commercetools';
import config from './config';

const Fastify = fastify({
  logger: true
});

Fastify.register(cors, {
  origin: ['https://vigorous-hermann-1d31e8.netlify.com'],
  methods: ['GET']
});
Fastify.register(config);
Fastify.register(commercetools);
Fastify.register(arecibo, {
  message: 'OK',
  readinessURL: '/ready',
  livenessURL: '/live',
  readinessCallback: (req, reply) => {
    const requestBuilder = Fastify.getRequestBuilder();
    return Fastify.commercetools
      .execute({
        uri: requestBuilder.project.build(),
        method: 'GET'
      })
      .then(() => 'OK');
  }
});
Fastify.register(routes);

const start = async () => {
  try {
    await Fastify.listen(3000, '0.0.0.0', (err, address) => {
      if (err) {
        Fastify.log.error(err);
        process.exit(1);
      }
    });
  } catch (err) {
    Fastify.log.error(err);
    process.exit(1);
  }
};

start();
