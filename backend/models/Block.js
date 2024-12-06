const mongoose = require('mongoose');


const blockSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'header', 'list', 'to-do', 'quote', 'code', 'embed', 'table'],
  },
  content: { type: String, default: '' }, // Убрали обязательность
  position: { type: Number, required: true },
  parentBlockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Block', blockSchema);