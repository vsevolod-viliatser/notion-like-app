// src/components/TaskTemplateManager.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify'; // Импортируем только toast
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили

const TaskTemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    name: '',
    defaultTitle: '',
    defaultDescription: '',
    defaultDueDate: '',
    defaultRecurring: false,
    defaultRecurrencePattern: 'daily',
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await API.get('/taskTemplates'); // Корректный путь
      setTemplates(res.data);
    } catch (err) {
      console.error('Ошибка при получении шаблонов задач:', err);
      toast.error('Не удалось получить шаблоны задач.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/taskTemplates', form); // Корректный путь
      setForm({
        name: '',
        defaultTitle: '',
        defaultDescription: '',
        defaultDueDate: '',
        defaultRecurring: false,
        defaultRecurrencePattern: 'daily',
      });
      fetchTemplates();
      toast.success('Шаблон задачи успешно создан!');
    } catch (err) {
      console.error('Ошибка при создании шаблона задачи:', err);
      toast.error('Не удалось создать шаблон задачи.');
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      await API.delete(`/taskTemplates/${templateId}`); // Корректный путь
      fetchTemplates();
      toast.success('Шаблон задачи удален!');
    } catch (err) {
      console.error('Ошибка при удалении шаблона задачи:', err);
      toast.error('Не удалось удалить шаблон задачи.');
    }
  };

  return (
    <div className="task-template-manager">
      <h2>Шаблоны Задач</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название шаблона:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Заголовок по умолчанию:</label>
          <input
            type="text"
            name="defaultTitle"
            value={form.defaultTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Описание по умолчанию:</label>
          <textarea
            name="defaultDescription"
            value={form.defaultDescription}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Срок выполнения по умолчанию:</label>
          <input
            type="date"
            name="defaultDueDate"
            value={form.defaultDueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Повторяющаяся по умолчанию:</label>
          <input
            type="checkbox"
            name="defaultRecurring"
            checked={form.defaultRecurring}
            onChange={handleInputChange}
          />
        </div>
        {form.defaultRecurring && (
          <div>
            <label>Паттерн повторения по умолчанию:</label>
            <select
              name="defaultRecurrencePattern"
              value={form.defaultRecurrencePattern}
              onChange={handleInputChange}
            >
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
              <option value="yearly">Ежегодно</option>
            </select>
          </div>
        )}
        <button type="submit">Создать Шаблон</button>
      </form>

      <h3>Существующие Шаблоны</h3>
      <ul>
        {templates.map(template => (
          <li key={template._id}>
            <strong>{template.name}</strong> - {template.defaultTitle}
            <button onClick={() => deleteTemplate(template._id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskTemplateManager;