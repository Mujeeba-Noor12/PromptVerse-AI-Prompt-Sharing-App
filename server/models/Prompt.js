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

// Index for search functionality
promptSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
  description: 'text'
});

// Virtual for vote count
promptSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for total votes
promptSchema.virtual('totalVotes').get(function() {
  return this.upvotes.length + this.downvotes.length;
});

// Method to increment usage count
promptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Method to increment views
promptSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to vote (upvote or downvote)
promptSchema.methods.vote = function(userId, voteType) {
  userId = userId.toString();
  const upvoteIndex = this.upvotes.findIndex(id => id.toString() === userId);
  const downvoteIndex = this.downvotes.findIndex(id => id.toString() === userId);
  
  // Remove existing votes
  if (upvoteIndex !== -1) {
    this.upvotes.splice(upvoteIndex, 1);
  }
  if (downvoteIndex !== -1) {
    this.downvotes.splice(downvoteIndex, 1);
  }
  
  // Add new vote
  if (voteType === 'upvote') {
    this.upvotes.push(userId);
  } else if (voteType === 'downvote') {
    this.downvotes.push(userId);
  }
  
  return this.save();
};

// Method to toggle bookmark
promptSchema.methods.toggleBookmark = function(userId) {
  userId = userId.toString();
  const bookmarkIndex = this.bookmarks.findIndex(id => id.toString() === userId);
  if (bookmarkIndex === -1) {
    this.bookmarks.push(userId);
  } else {
    this.bookmarks.splice(bookmarkIndex, 1);
  }
  return this.save();
};

// Method to toggle like
promptSchema.methods.toggleLike = function(userId) {
  userId = userId.toString();
  const likeIndex = this.likes.findIndex(id => id.toString() === userId);
  if (likeIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(likeIndex, 1);
  }
  return this.save();
};

// Method to check if user has voted
promptSchema.methods.getUserVote = function(userId) {
  userId = userId.toString();
  if (this.upvotes.some(id => id.toString() === userId)) {
    return 'upvote';
  } else if (this.downvotes.some(id => id.toString() === userId)) {
    return 'downvote';
  }
  return null;
};

// Method to check if user has bookmarked
promptSchema.methods.isBookmarkedBy = function(userId) {
  userId = userId.toString();
  return this.bookmarks.some(id => id.toString() === userId);
};

// Ensure virtuals are included in JSON output
promptSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Prompt', promptSchema); 