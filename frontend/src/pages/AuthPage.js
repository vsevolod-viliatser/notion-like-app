// src/pages/AuthPage.js
import React, { useState } from 'react';
import API from '../api';

const AuthPage = ({ type }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = type === 'register' ? '/auth/register' : '/auth/login';
      const payload =
        type === 'register' ? { username, email, password } : { email, password };

      const res = await API.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      console.error('Authentication failed:', err);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>{type === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div className="input-group">
            <label>Юзернейм</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="input-group">
          <label>Пошта</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{type === 'register' ? 'Реєстрація' : 'Вхід'}</button>
      </form>
      <button
        type="button"
        onClick={() =>
          (window.location.href = type === 'register' ? '/login' : '/register')
        }
      >
        {type === 'register'
          ? 'Вже маєте акаунт? Логін'
          : "Немає облікового запису? зареєструватися"}
      </button>
    </div>
  );
};

export default AuthPage;