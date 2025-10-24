const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const connectionController = require('../controllers/connectionController');

router.post('/request', authMiddleware, connectionController.sendRequest);
router.post('/:id/accept', authMiddleware, connectionController.acceptRequest);
router.post('/:id/reject', authMiddleware, connectionController.rejectRequest);
router.get('/', authMiddleware, connectionController.listConnections);

module.exports = router;
