const cron = require('node-cron');
const Task = require('../models/Task');
const { sendReminder } = require('../utils/email');

console.log("Cron задача подключена успешно!");

cron.schedule('*/1 * * * *', async () => {
  console.log(`Cron-задача запущена в: ${new Date().toLocaleString()}`);
  try {
    // Текущее время в UTC
    const nowUTC = new Date();

    const tasks = await Task.find({
      notifyBefore: { $ne: null },
      completed: false,
    }).populate('userId');

    console.log("Найдено задач:", tasks.length);

    tasks.forEach((task) => {
      // Рассчитываем напоминание в UTC
      const reminderTimeUTC = new Date(task.dueDate.getTime() - task.notifyBefore * 60 * 1000);
      console.log(`Reminder for task "${task.title}" at ${reminderTimeUTC.toISOString()}`);
      console.log(`Текущее UTC время: ${nowUTC.toISOString()}`);

      const timeWindow = 60 * 1000; // 1 минута
      if (reminderTimeUTC <= nowUTC && reminderTimeUTC > new Date(nowUTC.getTime() - timeWindow)) {
        console.log(`Напоминание отправляется для задачи: "${task.title}"`);
        sendReminder(task, task.userId.email);
      } else {
        console.log(
          `Напоминание НЕ отправляется для задачи: "${task.title}". Время напоминания: ${reminderTimeUTC.toISOString()}`
        );
      }
    });
  } catch (error) {
    console.error('Ошибка при отправке напоминаний:', error);
  }
});
