// controllers/reminderController.js
const Task = require('../models/Task');

/**
 * Получение предстоящих напоминаний
 */
/**
 * Get upcoming reminders
 */
exports.getReminders = async (req, res) => {
  try {

    const now = new Date();
    const reminderTimeStart = new Date(now.getTime()); // Start checking from now
    const reminderTimeEnd = new Date(now.getTime() + 60 * 60 * 1000); // Up to 1 hour from now

    const tasksToRemind = await Task.find({
      userId: req.user._id,
      dueDate: {
        $gte: reminderTimeStart,
        $lt: reminderTimeEnd,
      },
      completed: false,
    });
    console.log('Matching tasks for reminders:', tasksToRemind);

    res.json(tasksToRemind);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders.' });
  }
};


