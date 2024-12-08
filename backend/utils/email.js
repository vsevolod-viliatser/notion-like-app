const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Вы можете использовать другую почтовую службу, например, Yahoo, Outlook
  auth: {
    user: process.env.EMAIL_USER, // Ваш email
    pass: process.env.EMAIL_PASS, // Ваш пароль приложения
  },
});

/**
 * Отправляет напоминание о задаче пользователю
 * @param {Object} task - Объект задачи
 * @param {string} email - Email пользователя
 */
const sendReminder = (task, email) => {
  console.log(
    `Отправка напоминания: Задача "${task.title}" с дедлайном ${new Date(task.dueDate).toLocaleString()} отправляется на email: ${email}`
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Напоминание о задаче: ${task.title}`,
    text: `Привет! Напоминаем о вашей задаче "${task.title}". Срок выполнения: ${new Date(task.dueDate).toLocaleString()}.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Ошибка при отправке напоминания:', err);
      return;
    }
    console.log('Напоминание отправлено:', info.response);
  });
};

/**
 * Отправляет уведомление о входе в аккаунт
 * @param {string} email - Email пользователя
 */
const sendLoginNotification = (email) => {
  console.log(
    `Уведомление о входе: email "${email}" был использован для входа в ${new Date().toLocaleString()}`
  );

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Уведомление о входе в аккаунт',
    text: `Здравствуйте! Вы успешно вошли в ваш аккаунт ${new Date().toLocaleString()}. Если это были не вы, пожалуйста, свяжитесь с поддержкой.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Ошибка при отправке уведомления о входе:', err);
      return;
    }
    console.log('Уведомление о входе отправлено:', info.response);
  });
};

module.exports = {
  sendReminder,
  sendLoginNotification,
};
