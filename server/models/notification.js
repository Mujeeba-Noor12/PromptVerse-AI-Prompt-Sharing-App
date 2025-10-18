const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  type: {
    type: String,
    enum: ['comment', 'reply', 'like', 'upvote', 'downvote', 'bookmark', 'system'],
    required: true
  },
  prompt: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
