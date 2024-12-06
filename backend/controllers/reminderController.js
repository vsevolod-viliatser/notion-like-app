// controllers/reminderController.js
const Task = require('../models/Task');

/**
 * Получение предстоящих напоминаний
 */
exports.getReminders = async (req, res) => {
  try {
    const now = new Date();
    const reminderTimeStart = new Date(now.getTime() + 1 * 60 * 1000); // За 1 минуту до срока
    const reminderTimeEnd = new Date(reminderTimeStart.getTime() + 1 * 60 * 1000); // В течение 1 минуты

    const tasksToRemind = await Task.find({
      userId: req.user._id,
      dueDate: {
        $gte: reminderTimeStart,
        $lt: reminderTimeEnd,
      },
      completed: false,
    });

    res.json(tasksToRemind);
  } catch (error) {
    console.error('Ошибка при получении напоминаний:', error);
    res.status(500).json({ error: 'Не удалось получить напоминания.' });
  }
};
