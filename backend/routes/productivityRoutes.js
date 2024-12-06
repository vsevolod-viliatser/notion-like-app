// routes/productivityRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { 
  getDailyProductivity, 
  getWeeklyProductivity, 
  getMonthlyProductivity 
} = require('../controllers/productivityController');

// Получение дневной продуктивности
router.get('/dailyProductivity', protect, getDailyProductivity);

// Получение недельной продуктивности
router.get('/weeklyProductivity', protect, getWeeklyProductivity);

// Получение месячной продуктивности
router.get('/monthlyProductivity', protect, getMonthlyProductivity);

module.exports = router;
