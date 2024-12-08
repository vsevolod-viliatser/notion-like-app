// src/components/Reminders.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(() => {
      fetchReminders();
    }, 60 * 1000); // Refresh every minute
  
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
      <h2>Майбутні нагадування</h2>
      {reminders.length === 0 ? (
        <p>Немає майбутніх нагадувань.</p>
      ) : (
        <ul>
          {reminders.map(reminder => (
            <li key={reminder._id}>
              <strong>{reminder.title}</strong> - {reminder.dueDate ? new Date(reminder.dueDate).toLocaleString() : 'Нема сроку'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reminders;