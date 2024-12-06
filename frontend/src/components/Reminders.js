// src/components/Reminders.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
    // Добавление интервала для периодического обновления напоминаний
    const interval = setInterval(() => {
      fetchReminders();
    }, 60 * 1000); // Обновлять каждую минуту

    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await API.get('/reminders'); // Корректный путь
      setReminders(res.data);
    } catch (err) {
      console.error('Ошибка при получении напоминаний:', err);
      toast.error('Не удалось получить напоминания.');
    }
  };

  return (
    <div className="reminders">
      <h2>Предстоящие Напоминания</h2>
      {reminders.length === 0 ? (
        <p>Нет предстоящих напоминаний.</p>
      ) : (
        <ul>
          {reminders.map(reminder => (
            <li key={reminder._id}>
              <strong>{reminder.title}</strong> - {reminder.dueDate ? new Date(reminder.dueDate).toLocaleString() : 'Без срока'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reminders;
