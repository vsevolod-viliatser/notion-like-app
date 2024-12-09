import React from 'react';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';

const PomodoroTimer = () => {
  const [time, setTime] = React.useState(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
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

  return (
    <div className="pomodoro-timer">
      <h3>Pomodoro Timer</h3>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={() => setTime(25 * 60)}>Reset</button>
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

  return (
    <div className="sidebar">
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="navigation-section">
        <button onClick={() => onSwitchView('productivity')}>Dashboard</button>
        <button onClick={() => onSwitchView('pages')}>Pages</button>
      </div>

      <div className="page-management-section">
        <button onClick={() => onAddPage(null)}>Add Page</button>
        <ul>
          {rootPages.map((page) => (
            <SidebarItem
              key={page._id}
              page={page}
              pages={pages}
              onSelectPage={onSelectPage}
              onAddSubPage={(parentPageId) => onAddPage(parentPageId)}
              onDeletePage={onDeletePage}
            />
          ))}
        </ul>
      </div>

      <div className="pomodoro-section">
        <PomodoroTimer />
      </div>
    </div>
  );
};

export default Sidebar;
