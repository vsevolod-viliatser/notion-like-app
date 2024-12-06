const axios = require('axios');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTJhZGI4NTc4OTg0Zjg3N2FlMDllNyIsImlhdCI6MTczMzQ4NTcwNCwiZXhwIjoxNzM2MDc3NzA0fQ.fc5eqFLnMgbEM1MzwMhx6W96WWeXnNkSz0eg2O1f4E8'; // Замените на ваш JWT

const createTestTask = async (title, recurrencePattern) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/tasks',
      {
        title,
        description: `Тест задачи с повторением: ${recurrencePattern}`,
        dueDate: new Date().toISOString(), // Сейчас
        recurring: true,
        recurrencePattern,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`Создана задача: ${response.data.title}`);
  } catch (err) {
    console.error('Ошибка при создании тестовой задачи:', err.response?.data || err.message);
  }
};

// Создаем задачи с разными интервалами
const main = async () => {
  await createTestTask('Тест ежедневно', 'daily');
  await createTestTask('Тест еженедельно', 'weekly');
  await createTestTask('Тест ежемесячно', 'monthly');
  await createTestTask('Тест ежегодно', 'yearly');
};

main();