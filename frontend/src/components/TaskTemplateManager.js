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
      const res = await API.get('/taskTemplates'); // Correct endpoint
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching task templates:', err);
      toast.error('Failed to fetch task templates.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDefaultRecurring = () => {
    setForm((prev) => ({
      ...prev,
      defaultRecurring: !prev.defaultRecurring,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/taskTemplates', form); // Correct endpoint
      setForm({
        name: '',
        defaultTitle: '',
        defaultDescription: '',
        defaultDueDate: '',
        defaultRecurring: false,
        defaultRecurrencePattern: 'daily',
      });
      fetchTemplates();
      toast.success('Task template created successfully!');
    } catch (err) {
      console.error('Error creating task template:', err);
      toast.error('Failed to create task template.');
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      await API.delete(`/taskTemplates/${templateId}`); // Correct endpoint
      fetchTemplates();
      toast.success('Task template deleted!');
    } catch (err) {
      console.error('Error deleting task template:', err);
      toast.error('Failed to delete task template.');
    }
  };

  return (
    <div className="task-template-manager">
      <h2>Шаблони Завдань</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Назва Шаблону:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Заголовок за Замовчуванням:</label>
          <input
            type="text"
            name="defaultTitle"
            value={form.defaultTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Опис за Замовчуванням:</label>
          <textarea
            name="defaultDescription"
            value={form.defaultDescription}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <label>Термін Виконання за Замовчуванням:</label>
          <input
            type="date"
            name="defaultDueDate"
            value={form.defaultDueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Повторення за Замовчуванням:</label>
          <button
            type="button"
            className={`toggle-button ${form.defaultRecurring ? 'active' : ''}`}
            onClick={toggleDefaultRecurring}
          >
            {form.defaultRecurring ? 'Так' : 'Ні'}
          </button>
        </div>
        {form.defaultRecurring && (
          <div>
            <label>Паттерн Повторення за Замовчуванням:</label>
            <select
              name="defaultRecurrencePattern"
              value={form.defaultRecurrencePattern}
              onChange={handleInputChange}
            >
              <option value="daily">Щодня</option>
              <option value="weekly">Щотижня</option>
              <option value="monthly">Щомісяця</option>
              <option value="yearly">Щороку</option>
            </select>
          </div>
        )}
        <button type="submit">Створити Шаблон</button>
      </form>
  
      <h3>Існуючі Шаблони</h3>
      <ul>
        {templates.map((template) => (
          <li key={template._id}>
            <strong>{template.name}</strong> - {template.defaultTitle}
            <button onClick={() => deleteTemplate(template._id)}>Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default TaskTemplateManager;
