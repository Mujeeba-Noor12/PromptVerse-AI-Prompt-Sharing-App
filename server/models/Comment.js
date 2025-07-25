const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for vote count
commentSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Method to vote on comment
commentSchema.methods.vote = function(userId, voteType) {
  const upvoteIndex = this.upvotes.indexOf(userId);
  const downvoteIndex = this.downvotes.indexOf(userId);
  
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

// Method to check if user has voted
commentSchema.methods.getUserVote = function(userId) {
  if (this.upvotes.includes(userId)) {
    return 'upvote';
  } else if (this.downvotes.includes(userId)) {
    return 'downvote';
  }
  return null;
};

// Method to mark as edited
commentSchema.methods.markAsEdited = function() {
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Ensure virtuals are included in JSON output
commentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema); 