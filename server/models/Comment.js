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


commentSchema.virtual('voteCount').get(function() {
  try {
    const upCount = this?.upvotes?.length || 0;
    const downCount = this?.downvotes?.length || 0;
    return upCount - downCount;
  } catch (_) {
    return 0;
  }
});


commentSchema.methods.vote = function(userId, voteType) {
  if (!Array.isArray(this.upvotes)) this.upvotes = [];
  if (!Array.isArray(this.downvotes)) this.downvotes = [];
  const upvoteIndex = this.upvotes.findIndex(id => id.toString() === userId.toString());
  const downvoteIndex = this.downvotes.findIndex(id => id.toString() === userId.toString());
 
  if (upvoteIndex !== -1) {
    this.upvotes.splice(upvoteIndex, 1);
  }
  if (downvoteIndex !== -1) {
    this.downvotes.splice(downvoteIndex, 1);
  }
  

  if (voteType === 'upvote') {
    this.upvotes.push(userId);
  } else if (voteType === 'downvote') {
    this.downvotes.push(userId);
  }
  
  return this.save();
};


commentSchema.methods.getUserVote = function(userId) {
  if (!Array.isArray(this.upvotes)) this.upvotes = [];
  if (!Array.isArray(this.downvotes)) this.downvotes = [];
  if (this.upvotes.some(id => id.toString() === userId.toString())) {
    return 'upvote';
  } else if (this.downvotes.some(id => id.toString() === userId.toString())) {
    return 'downvote';
  }
  return null;
};

commentSchema.methods.markAsEdited = function() {
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};


commentSchema.set('toJSON', { virtuals: true });


commentSchema.path('upvotes').default([]);
commentSchema.path('downvotes').default([]);
commentSchema.path('replies').default([]);

module.exports = mongoose.model('Comment', commentSchema); 