const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  parentPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
