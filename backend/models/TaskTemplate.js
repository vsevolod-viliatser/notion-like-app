// models/TaskTemplate.js
const mongoose = require('mongoose');

const TaskTemplateSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  defaultTitle: {
    type: String,
    trim: true,
  },
  defaultDescription: {
    type: String,
    trim: true,
  },
  defaultDueDate: {
    type: Date,
  },
  defaultRecurring: {
    type: Boolean,
    default: false,
  },
  defaultRecurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily',
  },
}, { timestamps: true });

module.exports = mongoose.model('TaskTemplate', TaskTemplateSchema);
