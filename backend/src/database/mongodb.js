const mongoose = require('mongoose');
const { CONFIG } = require('../utils/config');
const { logger } = require('../utils/logger/logger');
const { Boom } = require('@hapi/boom');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(CONFIG.DATABASE.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw new Boom(error);
  }
};

module.exports = connectMongoDB;
