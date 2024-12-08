// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PageEditor from './pages/PageEditor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
const App = () => {
  const token = localStorage.getItem('token');
  const lastLoginTime = localStorage.getItem('lastLoginTime');
  const isAuthenticated = !!token;
  const isRecentLogin =
    lastLoginTime && Date.now() - parseInt(lastLoginTime, 10) <= 5 * 60 * 1000;

  const shouldRedirectToLogin = !isAuthenticated && !isRecentLogin;

  if (isAuthenticated && !lastLoginTime) {
    // Set the login timestamp if it doesn't exist
    localStorage.setItem('lastLoginTime', Date.now().toString());
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={shouldRedirectToLogin ? <Navigate to="/login" replace /> : <HomePage />}
        />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/register" element={<AuthPage type="register" />} />
        <Route
          path="/page/:id"
          element={shouldRedirectToLogin ? <Navigate to="/login" replace /> : <PageEditor />}
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
