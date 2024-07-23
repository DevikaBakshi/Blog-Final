const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorName: { type: String, required: true },
  authorEmail: { type: String, required: true },
  likes: [{ type: String }], // Array of user emails who liked the post
  likesCount: { type: Number, default: 0 },
  comments: [{ 
    content: { type: String, required: true },
    authorEmail: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
