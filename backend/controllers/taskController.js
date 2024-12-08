const Task = require('../models/Task')
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, notifyBefore, recurring, recurrencePattern } = req.body;

    const newTask = new Task({
      userId: req.user._id,
      title,
      description,
      dueDate,
      notifyBefore: notifyBefore || 60,
      recurring,
      recurrencePattern,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Ошибка при создании задачи:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    // Получаем только задачи текущего пользователя
    const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error('Ошибка при получении задач:', err);
    res.status(500).json({ error: err.message });
  }
}
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Ошибка при обновлении задачи:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // Удаляем задачу только среди задач текущего пользователя
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Ошибка при удалении задачи:', err);
    res.status(500).json({ error: err.message });
  }
}