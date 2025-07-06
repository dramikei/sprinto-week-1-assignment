const Sentry = require('@sentry/node');
const { CONFIG } = require('./config');
const { logger } = require('./logger/logger');

const initializeSentry = () => {
    if (
      CONFIG.SENTRY.DSN &&
      CONFIG.SENTRY.IS_ENABLED
    ) {
      // Ensure to call this before requiring any other modules!
      Sentry.init({
        dsn: CONFIG.SENTRY.DSN,
        normalizeDepth: 5,
        integrations: [
          Sentry.rewriteFramesIntegration({
            root: __dirname || process.cwd(),
          }),
        ],
      });
      logger.info('Sentry Initialized!');
    } else {
    if (!CONFIG.SENTRY.DSN) {
        logger.warn('Sentry DSN is missing! Sentry will be disabled!');
      } else {
        logger.warn('ENABLE_SENTRY is false! Sentry will be disabled');
      }
    }
  };

module.exports = initializeSentry;