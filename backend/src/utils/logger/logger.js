const { logLevels, validLogKeys } = require('./config');
const winston = require('winston'); 
const { CONFIG } = require('../config');

winston.addColors(logLevels.colors);

const consoleLogFormat = winston.format.printf((info) => {
  const { message, level, timestamp, ...consoleJSON } = info;
  if (silenceLogMetadata) {
    return `${timestamp ?? Date().toString()} ${level}: ${message}`;
  }
  delete consoleJSON.environment;
  if (Object.keys(consoleJSON).length === 0) {
    return `${timestamp ?? Date().toString()} ${level}: ${message}`;
  }
  return `${timestamp ?? Date().toString()} ${level}: ${message}\n${JSON.stringify(consoleJSON, null, 2)}`;
});

const transports = [];

if (CONFIG.APPLICATION.ENABLE_FILE_LOGGING) {
  transports.push(
    new winston.transports.File({
      filename: 'all_logs.log',
      level: CONFIG.APPLICATION.LOG_LEVEL,
      handleExceptions: true,
      handleRejections: true,
    }),
  );
}

if (CONFIG.APPLICATION.ENABLE_CONSOLE_LOGGING) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), consoleLogFormat),
      handleExceptions: true,
      handleRejections: true,
    }),
  );
}

// We can even add elasticsearch transport here

const logger = winston.createLogger({
  levels: logLevels.levels,
  level: CONFIG.APPLICATION.LOG_LEVEL,
  format: winston.format.json(),
  exitOnError: false,
  transports: transports,
  defaultMeta: { environment: CONFIG.APPLICATION.ENVIRONMENT },
});

const silenceLogMetadata = CONFIG.APPLICATION.ENVIRONMENT !== 'development'; // controls output of JSON context in terminal

logger.on('error', (error) => {
  console.error('Error in logger caught', error);
});

logger.on('error', (error) => {
  console.error('Error in elasticsearch transport caught', error);
});

module.exports = { logger };