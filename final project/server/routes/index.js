const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const connectionRoutes = require('./connectionRoutes');
const postRoutes = require('./postRoutes');
const searchRoutes = require('./searchRoutes');

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/connections', connectionRoutes);
router.use('/posts', postRoutes);
router.use('/search', searchRoutes);

module.exports = router;
