import React, { useState, useEffect } from 'react';
import API from '../api';
import 'react-toastify/dist/ReactToastify.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    notifyBefore: 60, // Добавлено поле для настройки времени уведомления
    recurring: false,
    recurrencePattern: 'daily',
  });
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchTemplates();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await API.get('/taskTemplates');
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching task templates:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRecurring = () => {
    setForm((prev) => ({
      ...prev,
      recurring: !prev.recurring,
    }));
  };

  const handleTemplateSelect = (templateId) => {
    const selectedTemplate = templates.find((template) => template._id === templateId);
    if (selectedTemplate) {
      setForm({
        title: selectedTemplate.defaultTitle || '',
        description: selectedTemplate.defaultDescription || '',
        dueDate: selectedTemplate.defaultDueDate
          ? new Date(selectedTemplate.defaultDueDate).toISOString().split('T')[0]
          : '',
        notifyBefore: selectedTemplate.defaultNotifyBefore || 60,
        recurring: selectedTemplate.defaultRecurring || false,
        recurrencePattern: selectedTemplate.defaultRecurrencePattern || 'daily',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', form);
      setForm({
        title: '',
        description: '',
        dueDate: '',
        notifyBefore: 60,
        recurring: false,
        recurrencePattern: 'daily',
      });
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const toggleCompletion = async (taskId, currentStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, {
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date().toISOString() : null,
      });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  return (
    <div className="task-manager">
      <h2>Управління Завданнями</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Виберіть Шаблон Завдання:</label>
          <select onChange={(e) => handleTemplateSelect(e.target.value)}>
            <option value="">--Виберіть Шаблон--</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Назва:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Опис:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Термін Виконання:</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={form.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Напомнить за (минут):</label>
          <input
            type="number"
            name="notifyBefore"
            value={form.notifyBefore}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        <div>
          <label>Повторюване Завдання:</label>
          <button
            type="button"
            className={`toggle-button ${form.recurring ? 'active' : ''}`}
            onClick={toggleRecurring}
          >
            {form.recurring ? 'Так' : 'Ні'}
          </button>
        </div>
        {form.recurring && (
          <div>
            <label>Паттерн Повторення:</label>
            <select
              name="recurrencePattern"
              value={form.recurrencePattern}
              onChange={handleInputChange}
            >
              <option value="daily">Щодня</option>
              <option value="weekly">Щотижня</option>
              <option value="monthly">Щомісяця</option>
              <option value="yearly">Щороку</option>
            </select>
          </div>
        )}
        <button type="submit">Створити Завдання</button>
      </form>

      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? 'Приховати Виконані Завдання' : 'Показати Виконані Завдання'}
      </button>

      <h3>Ваші Завдання</h3>
      <ul>
        {tasks
          .filter((task) => (showCompleted ? true : !task.completed))
          .map((task) => (
            <li key={task._id}>
              <button
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
                onClick={() => toggleCompletion(task._id, task.completed)}
              >
                {task.completed ? '✓' : '☐'}
              </button>
              <span>
                {task.title} - {new Date(task.dueDate).toLocaleString()}
              </span>
              {task.recurring && <span> (Повторення {task.recurrencePattern})</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TaskManager;
