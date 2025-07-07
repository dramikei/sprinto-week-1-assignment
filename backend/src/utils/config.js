const Boom = require('@hapi/boom');

const isDevelopment = process.env.NODE_ENV === 'development';

const getValue = (value) => {
  if (typeof value === 'string') {
    if(value.toLowerCase() === 'true') {
      return true;
    } else if(value.toLowerCase() === 'false') {
      return false;
    } else {
      return Number(value) || value;
    }
  }
  return value;
}

/**
 * @param {string} key
 * @param {any} defaultValue -- can be a string, number or boolean
 * @returns {any}
 */
const getEnvValueOrThrow = (key, defaultValue) => {
  if (process.env[key]) {
    const value = process.env[key]; 
    return getValue(value);
  } else if (defaultValue != null) {
    return getValue(defaultValue);
  }
  throw new Boom(`Config key ${key} not found`, {
    statusCode: 500,
  });
};

/**
 * @param {string} key
 * @param {any} defaultValue -- can be a string, number or boolean
 * @returns {any}
 */
const getEnvValue = (key, defaultValue) => {
  if (process.env[key]) {
    const value = process.env[key]; 
    return getValue(value);
  } else if (defaultValue != null) {
    return getValue(defaultValue);
  }
  return null;
};

const CONFIG = {
    APPLICATION: {
        LOG_LEVEL: getEnvValueOrThrow('LOG_LEVEL', isDevelopment ? 'debug' : 'info'),
        ENABLE_FILE_LOGGING: getEnvValueOrThrow('ENABLE_FILE_LOGGING', isDevelopment ? true : false),
        ENABLE_CONSOLE_LOGGING: getEnvValueOrThrow('ENABLE_CONSOLE_LOGGING', isDevelopment ? true : false),
        ENVIRONMENT: getEnvValueOrThrow('NODE_ENV'),
        PORT: getEnvValueOrThrow('PORT'),
    },
    DATABASE: {
        POSTGRES_HOST: getEnvValueOrThrow('POSTGRES_HOST'),
        POSTGRES_PORT: getEnvValueOrThrow('POSTGRES_PORT', isDevelopment ? 5432 : null),
        POSTGRES_DB: getEnvValueOrThrow('POSTGRES_DB', isDevelopment ? 'book_management' : null),
        POSTGRES_USER: getEnvValueOrThrow('POSTGRES_USER', isDevelopment ? 'postgres' : null),
        POSTGRES_PASSWORD: getEnvValueOrThrow('POSTGRES_PASSWORD', isDevelopment ? 'password' : null),
        MONGODB_URI: getEnvValueOrThrow('MONGODB_URI', isDevelopment ? 'mongodb://localhost:27017/book_management_meta' : null),
    },
    CORS: {
        ORIGIN: getEnvValueOrThrow('FRONTEND_URL', isDevelopment ? 'http://localhost:3000' : null),
        CREDENTIALS: true,
    },
    SENTRY: {
        DSN: getEnvValue('SENTRY_DSN'),
        IS_ENABLED: getEnvValue('ENABLE_SENTRY', false),
    },
    S3: {
      BUCKET: getEnvValueOrThrow('S3_BUCKET'),
      ENDPOINT: getEnvValueOrThrow('S3_ENDPOINT'),
      PORT: getEnvValueOrThrow('S3_PORT'),
      ACCESS_KEY: getEnvValueOrThrow('S3_ACCESS_KEY'),
      SECRET_KEY: getEnvValueOrThrow('S3_SECRET_KEY'),
    }
};



module.exports = { CONFIG };