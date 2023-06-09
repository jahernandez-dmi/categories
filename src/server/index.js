const fastify = require('fastify');
const config = require('#plugins/config');
const health = require('#plugins/health');
const swagger = require('#plugins/swagger');
const metrics = require('#plugins/metrics');
const errorHandler = require('#plugins/error-handler');
const commercetools = require('#plugins/commercetools');
const routes = require('#routes');

function index() {
  const Fastify = fastify({
    logger: {
      prettyPrint: false,
      redact: {
        //add here sensible fields that should not be logged
        paths: [
          'key',
          'body.password',
          'password',
          'Authorization',
          'headers.Authorization'
        ],
        censor: '*********'
      },
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
            hostname: req.hostname,
            path: req.path,
            parameters: req.parameters,
            id: req.id
          };
        }
      },
      formatters: {
        level: label => ({ level: label })
      }
    }
  });

  Fastify.addHook('preHandler', (req, reply, done) => {
    if (req.params && Object.keys(req.params).length !== 0) {
      req.log.info({ params: req.params }, 'request params');
    }
    if (req.query && Object.keys(req.query).length !== 0) {
      req.log.info({ queryParams: req.query }, 'request query params');
    }
    if (req.body && Object.keys(req.body).length !== 0) {
      req.log.info({ body: req.body }, 'parsed body');
    }
    done();
  });

  //this is only set to true after listening on port, see start fn
  Fastify.decorate('serviceAvailable', false);

  Fastify.register(config);
  Fastify.register(health);
  Fastify.register(swagger);
  Fastify.register(errorHandler);
  Fastify.register(commercetools);
  Fastify.register(metrics);
  Fastify.register(routes);

  ['SIGTERM', 'SIGINT', 'SIGQUIT'].forEach(signal => {
    Fastify.log.debug(`Listening on ${signal}`);
    process.on(signal, () => {
      Fastify.log.info(`${signal} signal received. Terminating service`);
      Fastify.serviceAvailable = false;
      Fastify.close(err => {
        if (err) {
          Fastify.log.error(err);
          process.exit(1);
        }
        Fastify.log.info('Done.');
        process.exit(0);
      });
    });
  });

  return Fastify;
}

module.exports = index;
