const Fastify = require('./src/server')();

const start = async () => {
  try {
    await Fastify.ready();
    await Fastify.listen({
      port: Fastify.config.PORT,
      host: Fastify.config.HOST
    });
    //eslint-disable-next-line
    Fastify.serviceAvailable = true;
  } catch (err) {
    //eslint-disable-next-line
    Fastify.serviceAvailable = false;
    Fastify.log.error(err);
    process.exit(1);
  }
};

start();
