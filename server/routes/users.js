const express = require('express');
const Prompt = require('../models/Prompt');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Get public user profile
// @access  Public
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's public prompts
    const prompts = await Prompt.find({
      author: user._id,
      isPublic: true
    })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(10);

    // Get user stats
    const totalPrompts = await Prompt.countDocuments({
      author: user._id,
      isPublic: true
    });

    const totalViews = await Prompt.aggregate([
      { $match: { author: user._id, isPublic: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalLikes = await Prompt.aggregate([
      { $match: { author: user._id, isPublic: true } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
    ]);

    res.json({
      user,
      prompts,
      stats: {
        totalPrompts,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me/prompts
// @desc    Get current user's prompts (including private ones)
// @access  Private
router.get('/me/prompts', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, isPublic } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { author: req.user._id };
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    const prompts = await Prompt.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      prompts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + prompts.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me/liked
// @desc    Get current user's liked prompts
// @access  Private
router.get('/me/liked', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prompts = await Prompt.find({
      likes: req.user._id,
      isPublic: true
    })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Prompt.countDocuments({
      likes: req.user._id,
      isPublic: true
    });

    res.json({
      prompts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + prompts.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get liked prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      username: { $regex: q.trim(), $options: 'i' }
    })
    .select('username avatar bio')
    .sort({ username: 1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await User.countDocuments({
      username: { $regex: q.trim(), $options: 'i' }
    });

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/top
// @desc    Get top users by prompt count
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topUsers = await Prompt.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$author', promptCount: { $sum: 1 } } },
      { $sort: { promptCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          username: '$user.username',
          avatar: '$user.avatar',
          bio: '$user.bio',
          promptCount: 1
        }
      }
    ]);

    res.json({ users: topUsers });
  } catch (error) {
    console.error('Get top users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 