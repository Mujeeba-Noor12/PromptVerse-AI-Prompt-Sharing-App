const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Prompt = require('../models/Prompt');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { auth, optionalAuth } = require('../middleware/auth');
const { sendNotification } = require('./sendNotification');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'newest', q } = req.query;
    let query = { isPublic: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const searchTerm = (q || search || '').trim();
   
  if (searchTerm) {
  const matchedAuthors = await User.find({
    username: { $regex: searchTerm, $options: 'i' }
  }).select('_id username');

  console.log('Matched authors:', matchedAuthors);
console.log('QUERY:', req.query);

  const authorIds = matchedAuthors.map(u => u._id);
  const orConditions = [
    { title: { $regex: searchTerm, $options: 'i' } },
    { description: { $regex: searchTerm, $options: 'i' } },
    { tags: { $regex: searchTerm, $options: 'i' } },
  ];

  if (authorIds.length > 0) {
    orConditions.push({ author: { $in: authorIds } });
  }

  query.$or = orConditions;
}




    // sorting logic same
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
      .limit(Number(limit))
      .skip((page - 1) * Number(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      prompts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



//   try {
//     const id = req.params.id && typeof req.params.id === 'string' ? req.params.id : '';
   
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid prompt id' });
//     }

//     const prompt = await Prompt.findById(id)
//       .populate('author', 'username avatar')
//       .populate('upvotes', 'username')
//       .populate('downvotes', 'username')
//       .populate('bookmarks', 'username');
    
//     if (!prompt) {
//       return res.status(404).json({ message: 'Prompt not found' });
//     }
    
//     // ✅ Increment views only if user is not the author
//     if (!req.user || prompt.author._id.toString() !== req.user._id.toString()) {
//       await prompt.incrementViews();
//     }
    
//     res.json(prompt);
//   } catch (error) {
//     console.error('Get prompt error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




// router.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id && typeof req.params.id === 'string' ? req.params.id : '';
   
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid prompt id' });
//     }

//     const prompt = await Prompt.findById(id)
//       .populate('author', 'username avatar')
//       .populate('upvotes', 'username')
//       .populate('downvotes', 'username')
//       .populate('bookmarks', 'username');
    
//     if (!prompt) {
//       return res.status(404).json({ message: 'Prompt not found' });
//     }
    
//     // Increment views
//     await prompt.incrementViews();
    
//     res.json(prompt);
//   } catch (error) {
//     console.error('Get prompt error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate('author', 'username avatar');

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    await prompt.addView(req.user?._id);

    res.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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
    
    const { title, content, description, tags, isPublic, category } = req.body;
    
    const prompt = new Prompt({
      title,
      content,
      description: description || '',
      tags: tags || [],
      category,
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
      author: req.user._id
    });
    
    await prompt.save();
    
    const populatedPrompt = await Prompt.findById(prompt._id)
      .populate('author', 'username avatar');

    res.status(201).json(populatedPrompt);

    if (prompt.isPublic) {
      setImmediate(async () => {
        try {
          const author = await User.findById(req.user._id).select('followers username');
          const followerIds = (author?.followers || []).filter(id => id.toString() !== req.user._id.toString());
          if (followerIds.length === 0) return;

          const message = `${req.user.username} posted a new prompt "${prompt.title}"`;

          for (const recipientId of followerIds) {
            await sendNotification({
              userId: recipientId,
              senderId: req.user._id,
              type: 'system',
              promptId: prompt._id,
              message
            });
          }
        } catch (notifyErr) {
          console.error('Broadcast new prompt notifications error:', notifyErr);
        }
      });
    }
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    if (prompt.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Prompt.findByIdAndDelete(id);
    
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:id/use', async (req, res) => {
  try {
    const id = req.params.id && typeof req.params.id === 'string' ? req.params.id : '';
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    
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
    const id = req.params.id && typeof req.params.id === 'string' ? req.params.id : '';
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.vote(req.user._id, req.body.voteType);
    
    const updatedPrompt = await Prompt.findById(id)
      .populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});


router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const id = req.params.id && typeof req.params.id === 'string' ? req.params.id : '';
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.toggleBookmark(req.user._id);
    
    const updatedPrompt = await Prompt.findById(id)
      .populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});
// ✅ Get bookmarked prompts (with pagination)
router.get('/bookmarks/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const total = await Prompt.countDocuments({ bookmarks: req.user._id });

    const prompts = await Prompt.find({ bookmarks: req.user._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    res.json({
      prompts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/users/me/liked', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { likes: req.user._id };

    const total = await Prompt.countDocuments(query);

    const prompts = await Prompt.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    res.json({
      prompts,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get liked prompts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/:id/like', auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    
    await prompt.toggleLike(req.user._id);
    
    if (prompt.author.toString() !== req.user._id.toString()) {
      await sendNotification({
        userId: prompt.author,
        senderId: req.user._id,
        type: 'like',
        promptId: prompt._id,
        message: `${req.user.username} liked your prompt "${prompt.title}"`
      });
    }
    
    const updatedPrompt = await Prompt.findById(id)
      .populate('author', 'username avatar');
    
    res.json(updatedPrompt);
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});


router.get('/:id/comments', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    const comments = await Comment.find({ prompt: id })
      .populate('author', 'username avatar')
      .populate('upvotes', 'username')
      .populate('downvotes', 'username')
      .sort({ createdAt: 1 });

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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid prompt id' });
    }
    if (req.body.parent && !mongoose.Types.ObjectId.isValid(req.body.parent)) {
      return res.status(400).json({ message: 'Invalid parent comment id' });
    }

    const prompt = await Prompt.findById(id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      prompt: id,
      parent: req.body.parent || null
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');

    // Notification: Comment on prompt
    if (prompt.author.toString() !== req.user._id.toString()) {
      await sendNotification({
        userId: prompt.author,
        senderId: req.user._id,
        type: 'comment',
        promptId: prompt._id,
        commentId: comment._id,
        message: `${req.user.username} commented on your prompt "${prompt.title}"`
      });
    }

   
    if (req.body.parent) {
      const parentComment = await Comment.findById(req.body.parent).populate('author');
      if (
        parentComment &&
        parentComment.author &&
        parentComment.author._id.toString() !== req.user._id.toString()
      ) {
        await sendNotification({
          userId: parentComment.author._id,
          senderId: req.user._id,
          type: 'reply',
          promptId: prompt._id,
          commentId: comment._id,
          message: `${req.user.username} replied to your comment on "${prompt.title}"`
        });
      }
    }

    try {
      const mentionMatches = (req.body.content || '').match(/@([A-Za-z0-9_]+)/g) || [];
      if (mentionMatches.length > 0) {
        const usernames = Array.from(new Set(mentionMatches.map(m => m.slice(1)))).slice(0, 10);
        const mentionedUsers = await User.find({ username: { $in: usernames } }).select('_id username');
        for (const mentioned of mentionedUsers) {
          if (mentioned._id.toString() === req.user._id.toString()) continue;
          await sendNotification({
            userId: mentioned._id,
            senderId: req.user._id,
            type: 'mention',
            promptId: prompt._id,
            commentId: comment._id,
            message: `${req.user.username} mentioned you in a comment on "${prompt.title}"`
          });
        }
      }
    } catch (mentionErr) {
      // do not block
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    await comment.vote(req.user._id, req.body.voteType);
    
    const updatedComment = await Comment.findById(id)
      .populate('author', 'username avatar');
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Comment vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    comment.content = req.body.content;
    await comment.markAsEdited();
    
    const updatedComment = await Comment.findById(id)
      .populate('author', 'username avatar');
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

 
    await Comment.deleteMany({
      $or: [
        { _id: id },
        { parent: id }
      ]
    });

    res.json({ message: 'Comment and its replies deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/users/me/prompts', auth, async (req, res) => {
  try {
    const { isPublic, page = 1, limit = 20 } = req.query;

    const query = { author: req.user._id };

    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
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
