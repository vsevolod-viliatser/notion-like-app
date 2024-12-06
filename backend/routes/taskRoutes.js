// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { 
  createTask,
  getTasks,
  updateTask,
  deleteTask 
} = require('../controllers/taskController');

// Создание новой задачи
router.post('/', protect, createTask);

// Получение всех задач
router.get('/', protect, getTasks);

// Обновление задачи
router.put('/:id', protect, updateTask);

// Удаление задачи
router.delete('/:id', protect, deleteTask);

module.exports = router;
