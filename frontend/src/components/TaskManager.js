// src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify'; // Импортируем только toast
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    recurring: false,
    recurrencePattern: 'daily',
  });

  useEffect(() => {
    fetchTasks();
    fetchTemplates();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка при получении задач:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await API.get('/taskTemplates');
      setTemplates(res.data);
    } catch (err) {
      console.error('Ошибка при получении шаблонов задач:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
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
        recurring: false,
        recurrencePattern: 'daily',
      });
      fetchTasks();
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
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
      console.error('Ошибка при обновлении задачи:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
    }
  };

  return (
    <div className="task-manager">
      <h2>Управление Задачами</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Выбрать шаблон задачи:</label>
          <select onChange={(e) => handleTemplateSelect(e.target.value)}>
            <option value="">--Выберите шаблон--</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Срок выполнения:</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Повторяющаяся задача:</label>
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleInputChange}
          />
        </div>
        {form.recurring && (
          <div>
            <label>Паттерн повторения:</label>
            <select
              name="recurrencePattern"
              value={form.recurrencePattern}
              onChange={handleInputChange}
            >
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
              <option value="yearly">Ежегодно</option>
            </select>
          </div>
        )}
        <button type="submit">Создать Задачу</button>
      </form>

      <h3>Ваши Задачи</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task._id, task.completed)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title} - {new Date(task.dueDate).toLocaleDateString()}
            </span>
            {task.recurring && <span> (Повторяется {task.recurrencePattern})</span>}
            <button onClick={() => deleteTask(task._id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default TaskManager;
