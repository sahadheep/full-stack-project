const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') console.debug('[DEBUG]', ...args);
  }
};

module.exports = logger;
