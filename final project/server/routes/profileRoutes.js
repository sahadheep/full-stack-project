const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, uploadSingle, profileController.createProfile);
router.get('/:userId', profileController.getProfile);
router.put('/', authMiddleware, uploadSingle, profileController.updateProfile);
router.get('/', profileController.listProfiles);
router.delete('/:userId', authMiddleware, profileController.deleteProfile);

module.exports = router;
