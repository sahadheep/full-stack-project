const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { authMiddleware, authLimiter } = require('../middleware/authMiddleware');

// Apply rate limiting to auth routes
router.use(authLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;
