const TaskTemplate = require('../models/TaskTemplate');

/**
 * Создание нового шаблона задачи
 */
exports.createTaskTemplate = async (req, res) => {
  try {
    // Логирование для отладки
    console.log('Создание шаблона задачи для пользователя:', req.user);

    const { name, defaultTitle, defaultDescription, defaultDueDate, defaultRecurring, defaultRecurrencePattern } = req.body;

    const template = new TaskTemplate({
      userId: req.user._id, // Устанавливаем userId из аутентифицированного пользователя
      name,
      defaultTitle,
      defaultDescription,
      defaultDueDate,
      defaultRecurring,
      defaultRecurrencePattern,
    });

    await template.save();
    res.status(201).json(template);
  } catch (err) {
    console.error('Ошибка при создании шаблона задачи:', err);
    res.status(400).json({ error: err.message });
  }
}

/**
 * Получение всех шаблонов задач текущего пользователя
 */
exports.getTaskTemplates = async (req, res) => {
  try {
    const templates = await TaskTemplate.find({ userId: req.user._id });
    res.json(templates);
  } catch (err) {
    console.error('Ошибка при получении шаблонов задач:', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * Удаление шаблона задачи
 */
exports.deleteTaskTemplate = async (req, res) => {
  try {
    const template = await TaskTemplate.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!template) return res.status(404).json({ error: 'Template not found or not authorized' });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Ошибка при удалении шаблона задачи:', err);
    res.status(500).json({ error: err.message });
  }
}