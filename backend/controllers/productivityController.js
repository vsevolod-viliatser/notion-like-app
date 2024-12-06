// controllers/productivityController.js
const Task = require('../models/Task');

/**
 * Получение дневной продуктивности за последние 30 дней
 */
exports.getDailyProductivity = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Task.aggregate([
      {
        $match: {
          userId: req.user._id, // Фильтруем по текущему пользователю
          completed: true,
          completedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
            day: { $dayOfMonth: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Преобразование данных в удобный формат
    const formattedData = data.map(item => ({
      date: `${item._id.year}-${item._id.month}-${item._id.day}`,
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Ошибка при получении дневной продуктивности:', error);
    res.status(500).json({ error: 'Не удалось получить данные продуктивности.' });
  }
};

/**
 * Получение недельной продуктивности за последний год
 */
exports.getWeeklyProductivity = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const data = await Task.aggregate([
      {
        $match: {
          userId: req.user._id, // Фильтруем по текущему пользователю
          completed: true,
          completedAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            week: { $isoWeek: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 },
      },
    ]);

    // Преобразование данных в удобный формат
    const formattedData = data.map(item => ({
      week: `Year ${item._id.year} - Week ${item._id.week}`,
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Ошибка при получении недельной продуктивности:', error);
    res.status(500).json({ error: 'Не удалось получить данные продуктивности.' });
  }
};

/**
 * Получение месячной продуктивности за последний год
 */
exports.getMonthlyProductivity = async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const data = await Task.aggregate([
      {
        $match: {
          userId: req.user._id, // Фильтруем по текущему пользователю
          completed: true,
          completedAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Преобразование данных в удобный формат
    const formattedData = data.map(item => ({
      month: `${item._id.year}-${item._id.month}`,
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Ошибка при получении месячной продуктивности:', error);
    res.status(500).json({ error: 'Не удалось получить данные продуктивности.' });
  }
};
