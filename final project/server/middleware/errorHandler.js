const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Server Error', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ status: 'error', message: err.message, code: 400 });
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const key = Object.keys(err.keyPattern || {}).join(', ');
    return res.status(409).json({ status: 'error', message: `Duplicate value for fields: ${key}`, code: 409 });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token', code: 401 });
  }
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ status: 'error', message, code: status });
}

module.exports = { errorHandler };
