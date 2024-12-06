// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-quill/dist/quill.snow.css';
import './styles.css'; // We'll create this file for global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
