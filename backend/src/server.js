const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Database connections
const sequelize = require('./database/postgres');
const connectMongoDB = require('./database/mongodb');

async function startServer() {
  // Initialize databases
  await connectMongoDB();

  // Sync PostgreSQL database
  // TODO: Remove this after testing
  // await sequelize.sync({ force: false });
  
  const app = express();
  
  // CORS configuration
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
