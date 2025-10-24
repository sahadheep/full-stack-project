const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/envConfig');
const { isTokenBlacklisted } = require('../services/tokenBlacklistService');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateTokens(user) {
  const basePayload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name
  };

  // Add unique token ID and issued time for better security
  const accessPayload = {
    ...basePayload,
    tokenId: generateTokenId(),
    type: 'access',
    iat: Math.floor(Date.now() / 1000)
  };

  const refreshPayload = {
    ...basePayload,
    tokenId: generateTokenId(),
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000)
  };

  return {
    accessToken: jwt.sign(accessPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY }),
    refreshToken: jwt.sign(refreshPayload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY }),
    expiresIn: getExpirySeconds(ACCESS_TOKEN_EXPIRY)
  };
}

function verifyToken(token, type = 'access') {
  if (isTokenBlacklisted(token)) {
    throw new Error('Token has been revoked');
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  // Verify token type
  if (decoded.type !== type) {
    throw new Error('Invalid token type');
  }

  return decoded;
}

function generateTokenId() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function getExpirySeconds(expiryString) {
  const unit = expiryString.slice(-1);
  const value = parseInt(expiryString.slice(0, -1));
  
  switch(unit) {
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return value;
  }
}

module.exports = {
  generateTokens,
  verifyToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
};
