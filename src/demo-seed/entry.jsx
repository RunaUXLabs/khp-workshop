import React from 'react';
import { createRoot } from 'react-dom/client';
import '@seed-design/css/all.css';
import './global.css';
import App from './App.jsx';
createRoot(document.getElementById('seed-app')).render(<App />);
