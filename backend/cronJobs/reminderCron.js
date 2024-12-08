const cron = require('node-cron');
const Task = require('../models/Task');
const { sendReminder } = require('../utils/email');

cron.schedule('*/1 * * * *', async () => {
  console.log('Запуск проверки напоминаний...');
  try {
    const now = new Date();

    const tasks = await Task.find({
      notifyBefore: { $ne: null }, // Только задачи с указанием времени уведомления
      completed: false,
    }).populate('userId');

    tasks.forEach((task) => {
      const reminderTime = new Date(task.dueDate.getTime() - task.notifyBefore * 60 * 1000);
      if (reminderTime <= now && reminderTime > new Date(now.getTime() - 60 * 1000)) {
        // Если время уведомления уже настало или в пределах одной минуты
        sendReminder(task, task.userId.email);
        console.log(`Напоминание отправлено для задачи: ${task.title}`);
      }
    });
  } catch (error) {
    console.error('Ошибка при отправке напоминаний:', error);
  }
});
