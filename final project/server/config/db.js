const mongoose = require('mongoose');
const { DB_URL } = require('./envConfig');
const logger = require('./logger');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

async function connect() {
  try {
    await mongoose.connect(DB_URL, options);
    logger.info('MongoDB connected');
    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
    });
    mongoose.connection.on('error', err => {
      logger.error('MongoDB error', err);
    });
  } catch (err) {
    logger.error('MongoDB connection error', err);
    throw err;
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected (manual)');
  } catch (err) {
    logger.error('Error disconnecting MongoDB', err);
  }
}

module.exports = { connect, disconnect };
