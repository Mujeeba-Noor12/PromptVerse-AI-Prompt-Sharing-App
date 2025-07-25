const express = require('express');
const { body, validationResult } = require('express-validator');
const Prompt = require('../models/Prompt');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/prompts
// @desc    Get all prompts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'newest' } = req.query;
    
    let query = { isPublic: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { voteCount: -1 };
        break;
      case 'mostViewed':
        sortOption = { views: -1 };
        break;
      case 'mostUsed':
        sortOption = { usageCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const prompts = await Prompt.find(query)
      .populate('author', 'username avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Prompt.countDocuments(query);
    
    res.json({
      prompts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/prompts/:id
// @desc    Get single prompt
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('upvotes', 'username')
      .populate('downvotes', 'username')
      .populate('bookmarks', 'username');
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    // Increment views
    await prompt.incrementViews();
    
    res.json(prompt);
  } catch (error) {
    console.error('Get prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prompts
// @desc    Create a prompt
// @access  Private
router.post('/', auth, [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('category')
    .isIn(['chatgpt', 'midjourney', 'dalle', 'bard', 'claude', 'other'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, content, description, tags,isPublic , category } = req.body;
    
    const prompt = new Prompt({
      title,
      content,
      description: description || '',
      tags: tags || [],
      category,
      isPublic,

      // isPublic: typeof isPublic === 'boolean' ? isPublic : true, // fallback safety

      author: req.user._id
    });
    
    await prompt.save();
    
    const populatedPrompt = await Prompt.findById(prompt._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populatedPrompt);
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/prompts/:id
// @desc    Update a prompt
// @access  Private
router.put('/:id', auth, [
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .optional()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('category')
    .optional()
    .isIn(['chatgpt', 'midjourney', 'dalle', 'bard', 'claude', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/prompts/:id
// @desc    Delete a prompt
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Prompt.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prompts/:id/use
// @desc    Increment usage count for a prompt
// @access  Public
router.post('/:id/use', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.incrementUsage();
    
    res.json({ message: 'Usage count updated' });
  } catch (error) {
    console.error('Use prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prompts/:id/vote
// @desc    Vote on a prompt
// @access  Private
router.post('/:id/vote', auth, [
  body('voteType')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.vote(req.user._id, req.body.voteType);
    
    const updatedPrompt = await Prompt.findById(req.params.id)
      .populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: error.message || 'Server error', error });
  }
});

// @route   POST /api/prompts/:id/bookmark
// @desc    Toggle bookmark on a prompt
// @access  Private
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.toggleBookmark(req.user._id);
    
    const updatedPrompt = await Prompt.findById(req.params.id)
      .populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: error.message || 'Server error', error });
  }
});
// @route   GET /api/prompts/bookmarks/me
// @desc    Get prompts bookmarked by the current user
// @access  Private
router.get('/bookmarks/me', auth, async (req, res) => {
  try {
    const prompts = await Prompt.find({ bookmarks: req.user._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(prompts);
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prompts/:id/like
// @desc    Toggle like on a prompt
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    await prompt.toggleLike(req.user._id);
    const updatedPrompt = await Prompt.findById(req.params.id)
      .populate('author', 'username avatar');
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: error.message || 'Server error', error });
  }
});
// @route   GET /api/prompts/:id/comments
// @desc    Get all comments (including replies) for a prompt
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ prompt: req.params.id })
      .populate('author', 'username avatar')
      .populate('upvotes', 'username')
      .populate('downvotes', 'username')
      .sort({ createdAt: 1 }); // optional: oldest first, or change to -1 for newest

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:id/comments', auth, [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      prompt: req.params.id,
      parent: req.body.parent || null
    });
    
    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/comments/:id/vote
// @desc    Vote on a comment
// @access  Private
router.post('/comments/:id/vote', auth, [
  body('voteType')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    await comment.vote(req.user._id, req.body.voteType);
    
    const updatedComment = await Comment.findById(req.params.id)
      .populate('author', 'username avatar');
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Comment vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private
router.put('/comments/:id', auth, [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.content = req.body.content;
    await comment.markAsEdited();
    
    const updatedComment = await Comment.findById(req.params.id)
      .populate('author', 'username avatar');
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// @route   GET /api/users/me/prompts
// @desc    Get prompts created by the logged-in user (with optional isPublic filter)
// @access  Private
router.get('/users/me/prompts', auth, async (req, res) => {
  try {
    const { isPublic, page = 1, limit = 20 } = req.query;

    const query = { author: req.user._id };

    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true'; // query params come as strings!
    }

    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    const total = await Prompt.countDocuments(query);

    res.json({
      prompts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get user prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router; 

