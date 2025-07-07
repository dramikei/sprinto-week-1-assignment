const { Boom } = require('@hapi/boom');
const { captureException } = require('@sentry/node');
const { logger } = require('../utils/logger/logger');

const apolloErrorHandlerMiddleware = (formattedError, error) => {
  if (formattedError.extensions.code === 'INTERNAL_SERVER_ERROR') {
    let errorDescription;
    let data;
    let logToSentry = true;
    if (error instanceof Boom && (error.output.statusCode === 404 || error.output.statusCode === 400)) {
      logToSentry = false;
    }
    if (error instanceof Boom) {
      errorDescription = error.message;
      data = {
        ...(error.data),
        ...(error.output),
      };
      data = error.data;
    } else {
      errorDescription = formattedError?.message ?? 'Internal Server Error';
      data = {};
    }

    console.log(error);
    if (logToSentry) {
      captureException({
        error: formattedError,
        payload: { ...data, errorDescription: errorDescription },
        message: formattedError?.message ?? 'Internal Server Error While Executing GraphQL Query',
      });
    }

    logger.error(errorDescription, {
      error: formattedError,
      payload: { ...data, errorDescription: errorDescription },
      message: formattedError?.message ?? 'Internal Server Error While Executing GraphQL Query',
    });

    return formattedError;
  }
};
  
  module.exports = apolloErrorHandlerMiddleware;