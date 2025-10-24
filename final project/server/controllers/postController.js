const Post = require('../models/Post');
const path = require('path');

async function createPost(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const post = await Post.create({
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
      attachments: req.files ? req.files.map(f => `/uploads/${path.basename(f.path)}`) : []
    });

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatarUrl')
      .populate('comments.userId', 'name avatarUrl');

    res.status(201).json({ status: 'success', data: populatedPost });
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  try {
    const { type, userId, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (userId) query.userId = userId;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'User'
      })
      .populate('likes')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'name email',
          model: 'User'
        }
      });

    const total = await Post.countDocuments(query);

    res.json({
      status: 'success',
      data: posts,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    next(err);
  }
}

async function likePost(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json({ status: 'success', data: post });
  } catch (err) {
    next(err);
  }
}

async function commentOnPost(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.id,
      content: req.body.content
    });

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatarUrl')
      .populate('comments.userId', 'name avatarUrl');

    res.json({ status: 'success', data: updatedPost });
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Not authenticated' 
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Post not found' 
      });
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You can only delete your own posts' 
      });
    }

    await Post.deleteOne({ _id: req.params.id });

    res.json({ 
      status: 'success', 
      message: 'Post deleted successfully' 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  deletePost
};