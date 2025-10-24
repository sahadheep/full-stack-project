const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

const { PORT } = require('./config/envConfig');
const db = require('./config/db');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect DB (skip automatic connect in tests)
if (process.env.NODE_ENV !== 'test') {
  db.connect().catch(err => {
    logger.error('Failed to connect to DB', err);
    process.exit(1);
  });
} else {
  // In test environment, tests should manage DB connection using mongoose directly.
  logger.info('Skipping automatic DB connect in test environment');
}

// Middleware
app.use(helmet());
const allowedOrigin = process.env.CLIENT_URL;
app.use(cors({
  origin: [allowedOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Start server only when not testing
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
} else {
  logger.info('Test environment detected - not starting server listener');
}

module.exports = app;
