require('dotenv').config();
require('./cronJobs/reminderCron')
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Инициализация приложения
const app = express();

// Middleware для обработки JSON
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Ошибка підключення до MongoDB:', err));

// Ваши маршруты API
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const blockRoutes = require('./routes/blockRoutes');
const tableRoutes = require('./routes/tableRoutes');
const productivityRoutes = require('./routes/productivityRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskTemplateRoutes = require('./routes/taskTemplateRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/taskTemplates', taskTemplateRoutes);
app.use('/api/reminders', reminderRoutes);


const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).send('API route not found');
  } else {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Глобальная обработка ошибок (опционально)
app.use((err, req, res, next) => {
  console.error('Глобальная ошибка:', err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
