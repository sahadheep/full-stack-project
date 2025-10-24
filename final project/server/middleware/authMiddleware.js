const { verifyToken } = require('../utils/tokenUtils');
const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});

function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Authorization token missing',
        code: 'TOKEN_MISSING'
      });
    }

    const token = auth.split(' ')[1];
    try {
      const payload = verifyToken(token, 'access');
      
      // Add user info to request
      req.user = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        tokenId: payload.tokenId
      };
      
      next();
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      throw tokenError;
    }
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: err.message || 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
}

module.exports = {
  authMiddleware,
  authLimiter
};
