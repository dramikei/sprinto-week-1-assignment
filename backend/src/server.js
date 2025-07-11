require('dotenv').config();
require('./utils/sentry')();
const express = require('express');
const cors = require('cors');
const { CONFIG } = require('./utils/config');
const errorHandlerMiddleware = require('./middleware/error-handler.middleware');
const apolloErrorHandlerMiddleware = require('./middleware/apollo-error-handler.middleware');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const http = require('http');

// Database connections
const PGModels = require('./models/postgres'); // Added so that the models are loaded before the server starts
const sequelize = require('./database/postgres');
const connectMongoDB = require('./database/mongodb');
const { logger } = require('./utils/logger/logger');
const { Boom } = require('@hapi/boom');

// GraphQL
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// S3-compatible client
const { MinioClient } = require('./utils/minio');
const z = require('zod');

async function startServer() {
  // Initialize databases
  await connectMongoDB();

  // Sync PostgreSQL database
  // WARNING: Should not use in production, rather use migrations.
  await sequelize.sync({ force: false });
  
  const app = express();
  const httpServer = http.createServer(app);
  
  console.log(CONFIG.APPLICATION.ENVIRONMENT);
  // CORS configuration
  app.use(cors({
    origin: CONFIG.APPLICATION.ENVIRONMENT === 'development' ? '*' : CONFIG.CORS.ORIGIN,
    credentials: true,
  }));
  

  app.use(express.json());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      // TODO: - Add authentication context here
      user: req.user,
    }),
    formatError: apolloErrorHandlerMiddleware,
  });
  
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  app.get('/presignedUrl', async (req, res) => {
    const { name, uploadType } = req.query;
    const parsedFileName = z.string().min(1).parse(name);
    const parsedUploadType = z.string().parse(uploadType);
    const objectName = 'uploads/' + parsedUploadType + '/' + parsedFileName;
    const fileUrl = 'http://' + CONFIG.S3.ENDPOINT + '/' + CONFIG.S3.BUCKET + '/' + objectName;
    const uploadUrl = (await MinioClient.presignedPutObject(CONFIG.S3.BUCKET, objectName, 60 * 60)); // 60 * 60 = 1 hour expiry
    res.json({ uploadUrl, fileUrl });
  });

  // Route not found
  app.use(() => {
    throw new Boom('Route not Found', {
      statusCode: 404,
    });
  });

  // Global error handler middleware
  app.use(errorHandlerMiddleware);
  
  const PORT = CONFIG.APPLICATION.PORT;

  httpServer.listen(PORT, () => {
    logger.info(`Server running at Port: ${PORT} 🚀`);
    logger.info(`Environment: ${CONFIG.APPLICATION.ENVIRONMENT}`);
    logger.info(`GraphQL Playground: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
