// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getReminders } = require('../controllers/reminderController');

// Получение напоминаний
router.get('/', protect, getReminders);

module.exports = router;
