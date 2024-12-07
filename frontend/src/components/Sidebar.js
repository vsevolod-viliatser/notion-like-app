// src/components/Sidebar.js
import React from 'react';
import SidebarItem from './SidebarItem';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60); // Таймер на 25 минут (в секундах)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60);
  };

  return (
    <div className="pomodoro-timer">
      <h3>Pomodoro Timer</h3>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <button onClick={handleStartPause}>{isRunning ? 'Пауза' : 'Старт'}</button>
        <button onClick={handleReset}>Сброс</button>
      </div>
    </div>
  );
};

const Sidebar = ({ pages, onAddPage, onSelectPage, onDeletePage, onSwitchView }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastLoginTime');
    navigate('/login');
  };

  const rootPages = pages.filter((page) => !page.parentPageId);

  const handleAddSubPage = (parentPageId) => {
    onAddPage(parentPageId);
  };

  return (
    <div className="sidebar">
      <button onClick={() => onAddPage(null)}>Додати сторінку</button>
      <button onClick={() => onSwitchView('productivity')}>Приладова панель</button> {/* New Dashboard Button */}
      <ul>
        {rootPages.map((page) => (
          <SidebarItem
            key={page._id}
            page={page}
            pages={pages}
            onSelectPage={onSelectPage}
            onAddSubPage={handleAddSubPage}
            onDeletePage={onDeletePage}
          />
        ))}
      </ul>
      <PomodoroTimer /> {/* Integration of Pomodoro Timer */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};


export default Sidebar;
