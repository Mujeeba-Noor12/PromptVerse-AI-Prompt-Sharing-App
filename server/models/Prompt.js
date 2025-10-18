const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['chatgpt', 'midjourney', 'dalle', 'bard', 'claude', 'other'],
    default: 'other'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Enhanced voting system
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Bookmarks
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  uniqueViews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  // Likes
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Ensure array fields default to [] to avoid undefined
promptSchema.path('upvotes').default([]);
promptSchema.path('downvotes').default([]);
promptSchema.path('bookmarks').default([]);
promptSchema.path('likes').default([]);
promptSchema.path('tags').default([]);

// Index for search functionality
promptSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text',
  description: 'text'
});

// Virtuals
promptSchema.virtual('voteCount').get(function () {
  const upCount = Array.isArray(this.upvotes) ? this.upvotes.length : 0;
  const downCount = Array.isArray(this.downvotes) ? this.downvotes.length : 0;
  return upCount - downCount;
});

promptSchema.virtual('totalVotes').get(function () {
  const upCount = Array.isArray(this.upvotes) ? this.upvotes.length : 0;
  const downCount = Array.isArray(this.downvotes) ? this.downvotes.length : 0;
  return upCount + downCount;
});


promptSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};


promptSchema.methods.addView = async function (userId) {

  if (!userId) {
    return this; 
  }


  if (this.author.toString() === userId.toString()) {
    return this;
  }


  if (!this.uniqueViews.some(id => id.toString() === userId.toString())) {
    this.uniqueViews.push(userId);
    this.views += 1;
    await this.save();
  }

  return this;
};


promptSchema.methods.vote = function (userId, voteType) {
  userId = userId.toString();
  if (!Array.isArray(this.upvotes)) this.upvotes = [];
  if (!Array.isArray(this.downvotes)) this.downvotes = [];

  const upvoteIndex = this.upvotes.findIndex(id => id.toString() === userId);
  const downvoteIndex = this.downvotes.findIndex(id => id.toString() === userId);

 
  if (upvoteIndex !== -1) this.upvotes.splice(upvoteIndex, 1);
  if (downvoteIndex !== -1) this.downvotes.splice(downvoteIndex, 1);

  if (voteType === 'upvote') {
    this.upvotes.push(userId);
  } else if (voteType === 'downvote') {
    this.downvotes.push(userId);
  }

  return this.save();
};

promptSchema.methods.toggleBookmark = function (userId) {
  userId = userId.toString();
  if (!Array.isArray(this.bookmarks)) this.bookmarks = [];

  const index = this.bookmarks.findIndex(id => id.toString() === userId);
  if (index === -1) {
    this.bookmarks.push(userId);
  } else {
    this.bookmarks.splice(index, 1);
  }
  return this.save();
};


promptSchema.methods.toggleLike = function (userId) {
  userId = userId.toString();
  if (!Array.isArray(this.likes)) this.likes = [];

  const index = this.likes.findIndex(id => id.toString() === userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  return this.save();
};


promptSchema.methods.getUserVote = function (userId) {
  userId = userId.toString();
  if (!Array.isArray(this.upvotes)) this.upvotes = [];
  if (!Array.isArray(this.downvotes)) this.downvotes = [];

  if (this.upvotes.some(id => id.toString() === userId)) {
    return 'upvote';
  } else if (this.downvotes.some(id => id.toString() === userId)) {
    return 'downvote';
  }
  return null;
};


promptSchema.methods.isBookmarkedBy = function (userId) {
  userId = userId.toString();
  if (!Array.isArray(this.bookmarks)) this.bookmarks = [];
  return this.bookmarks.some(id => id.toString() === userId);
};


promptSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Prompt', promptSchema);
