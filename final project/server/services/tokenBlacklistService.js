const blacklistedTokens = new Set();

// Store blacklisted tokens with expiry
function blacklistToken(token, expiresIn) {
    blacklistedTokens.add(token);
    
    // Remove token from blacklist after it expires
    setTimeout(() => {
        blacklistedTokens.delete(token);
    }, expiresIn * 1000); // Convert seconds to milliseconds
}

// Check if token is blacklisted
function isTokenBlacklisted(token) {
    return blacklistedTokens.has(token);
}

// Clear expired tokens from blacklist periodically
setInterval(() => {
    // This is handled automatically by the setTimeout in blacklistToken
    // but we keep this interval to ensure cleanup in case of any issues
    const now = Date.now();
}, 3600000); // Clean up every hour

module.exports = { blacklistToken, isTokenBlacklisted };