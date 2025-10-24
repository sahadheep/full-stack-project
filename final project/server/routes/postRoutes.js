const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadArray } = require('../middleware/uploadMiddleware');
const postController = require('../controllers/postController');

// Create a new post (with optional file attachments)
router.post('/', authMiddleware, uploadArray, postController.createPost);

// Get posts with optional filters
router.get('/', postController.getPosts); // Get all posts

// Like/unlike a post
router.post('/:id/like', authMiddleware, postController.likePost);

// Comment on a post
router.post('/:id/comments', authMiddleware, postController.commentOnPost);

// Delete a post
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;