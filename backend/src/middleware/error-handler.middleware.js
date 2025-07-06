const { logger } = require('../utils/logger/logger');
const { Boom } = require('@hapi/boom');
const { ZodError } = require('zod');
const { captureException } = require('@sentry/node');

const errorHandlerMiddleware = (e, req, res, next) => {
  try {
    // Rewrite error to Boom
    // If Zod error
    if (e instanceof ZodError) {
      logger.error('Bad Request', e.errors);
      // noinspection ExceptionCaughtLocallyJS
      throw new Boom('Invalid request', {
        statusCode: 400,
        data: e.errors,
      });
    } else if (e instanceof Boom) {
      throw e;
    } else {
      throw new Boom(e);
    }
  } catch (error) {
    let errorDescription;
    let data;
    let logToSentry = true;
    if (error instanceof Boom && (error.output.statusCode === 404 || error.output.statusCode === 400)) {
      logToSentry = false;
    }
    if (error instanceof Boom) {
      if (error.message === 'Route not Found') {
        logToSentry = false;
        errorDescription = `Route: ${req.method} ${req.path} not found`;
      } else {
        errorDescription = error.message;
        data = {
          ...(error.data),
          ...(error.output),
        };
      }
      data = error.data;
    } else {
      errorDescription = 'Internal Server Error';
      data = {};
    }

    if (logToSentry) {
      captureException({
        error,
        payload: { ...data, errorDescription: errorDescription },
        message: `Error while executing ${req.method} ${req.path}`,
      });
    }

    logger.error(errorDescription, {
      error,
      payload: { ...data, errorDescription: errorDescription },
      message: `Error while executing ${req.method} ${req.path}`,
    });

    res.json({
      status: 'error',
      message: errorDescription,
      data,
    });
    return;
  }
};

module.exports = errorHandlerMiddleware;