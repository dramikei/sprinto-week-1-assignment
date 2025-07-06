require('dotenv').config();
require('./utils/sentry')();
const express = require('express');
const cors = require('cors');
const { CONFIG } = require('./utils/config');
const errorHandlerMiddleware = require('./middleware/error-handler.middleware');


// Database connections
const sequelize = require('./database/postgres');
const connectMongoDB = require('./database/mongodb');
const { logger } = require('./utils/logger/logger');
const { Boom } = require('@hapi/boom');

async function startServer() {
  // Initialize databases
  await connectMongoDB();

  // Sync PostgreSQL database
  // TODO: Remove this after testing
  // await sequelize.sync({ force: false });
  
  const app = express();
  
  // CORS configuration
  app.use(cors({
    origin: CONFIG.CORS.ORIGIN,
    credentials: true,
  }));

  // Route not found
  app.use(() => {
    throw new Boom('Route not Found', {
      statusCode: 404,
    });
  });

  // Global error handler middleware
  app.use(errorHandlerMiddleware);
  
  const PORT = CONFIG.APPLICATION.PORT;
  app.listen(PORT, () => {
    logger.info(`Server running at Port: ${PORT} 🚀`);
    logger.info(`Environment: ${CONFIG.APPLICATION.ENVIRONMENT}`);
  });
}

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
