// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const blockRoutes = require('./routes/blockRoutes');
const tableRoutes = require('./routes/tableRoutes');
const productivityRoutes = require('./routes/productivityRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskTemplateRoutes = require('./routes/taskTemplateRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const cors = require('cors');
const cron = require('node-cron');
const sendReminder = require('./utils/email');
const Task = require('./models/Task');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/taskTemplates', taskTemplateRoutes);
app.use('/api/reminders', reminderRoutes);
// Глобальная обработка ошибок (опционально)
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Планировщик для повторяющихся задач (каждую ночь в полночь)
cron.schedule('0 0 * * *', async () => {
  console.log('Запуск планировщика повторяющихся задач...');
  try {
    // Находим все выполненные повторяющиеся задачи
    const recurringTasks = await Task.find({ recurring: true, completed: true });

    for (const task of recurringTasks) {
      let nextDueDate = new Date(task.dueDate);
      switch (task.recurrencePattern) {
        case 'daily':
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case 'weekly':
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case 'monthly':
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          break;
        default:
          continue;
      }

      // Создаём новую задачу с обновлённой датой
      const newTask = new Task({
        userId: task.userId,
        title: task.title,
        description: task.description,
        dueDate: nextDueDate,
        recurring: task.recurring,
        recurrencePattern: task.recurrencePattern,
        completed: false,
      });

      await newTask.save();
      console.log(`Создана повторяющаяся задача: ${newTask.title}`);
    }
  } catch (error) {
    console.error('Ошибка при создании повторяющихся задач:', error);
  }
});

// Планировщик для отправки напоминаний (каждый час)
cron.schedule('0 * * * *', async () => {
  console.log('Запуск планировщика напоминаний...');
  try {
    const now = new Date();
    const reminderTimeStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // За день до срока
    const reminderTimeEnd = new Date(reminderTimeStart.getTime() + 60 * 60 * 1000); // В течение часа

    // Находим задачи, срок выполнения которых подходит для отправки напоминания
    const tasksToRemind = await Task.find({
      dueDate: {
        $gte: reminderTimeStart,
        $lt: reminderTimeEnd,
      },
      completed: false,
    }).populate('userId'); // Предполагается, что userId ссылается на модель User

    tasksToRemind.forEach((task) => {
      if (task.userId && task.userId.email) {
        sendReminder(task, task.userId.email);
      } else {
        console.warn(`Нет email для задачи: ${task.title}`);
      }
    });
  } catch (error) {
    console.error('Ошибка при отправке напоминаний:', error);
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
