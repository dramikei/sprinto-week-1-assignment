const { Sequelize } = require('sequelize');
const { CONFIG } = require('../utils/config');
const { logger } = require('../utils/logger/logger');

const sequelize = new Sequelize(
  CONFIG.DATABASE.POSTGRES_DB,
  CONFIG.DATABASE.POSTGRES_USER,
  CONFIG.DATABASE.POSTGRES_PASSWORD,
  {
    host: CONFIG.DATABASE.POSTGRES_HOST,
    port: CONFIG.DATABASE.POSTGRES_PORT,
    dialect: 'postgres',
    logging: CONFIG.APPLICATION.ENVIRONMENT === 'development' ? postgresLogger : false,
  }
);

function postgresLogger(sql) {
  logger.debug(`SQL: ${sql}`);
}

module.exports = sequelize;
