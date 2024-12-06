// routes/taskTemplateRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { 
  createTaskTemplate, 
  getTaskTemplates, 
  deleteTaskTemplate 
} = require('../controllers/taskTemplateController');

// Создание шаблона задачи
router.post('/', protect, createTaskTemplate);

// Получение всех шаблонов задач
router.get('/', protect, getTaskTemplates);

// Удаление шаблона задачи
router.delete('/:id', protect, deleteTaskTemplate);

module.exports = router;
