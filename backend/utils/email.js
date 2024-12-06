// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Для загрузки переменных окружения

const transporter = nodemailer.createTransport({
  service: 'Gmail', // или другой сервис, например, 'Yahoo', 'Outlook'
  auth: {
    user: process.env.EMAIL_USER, // Ваш email
    pass: process.env.EMAIL_PASS, // Ваш пароль
  },
});

/**
 * Функция для отправки напоминания пользователю
 * @param {Object} task - Объект задачи
 * @param {string} email - Email пользователя
 */
const sendReminder = (task, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Динамический email пользователя
    subject: `Напоминание о задаче: ${task.title}`,
    text: `Привет! Это напоминание о вашей задаче: ${task.title}. Срок: ${new Date(task.dueDate).toLocaleDateString()}.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.error('Ошибка при отправке письма:', err);
    }
    console.log('Письмо отправлено:', info.response);
  });
};

module.exports = sendReminder;
