// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: {
    type: String,
    required: true,
    trim: true, // Удаляет пробелы в начале и конце
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
