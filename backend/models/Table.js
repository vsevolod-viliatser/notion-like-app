const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rows: { type: Array, required: true }, // Each row is an array of cell content
  columns: { type: Array, required: true }, // Column headers
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
