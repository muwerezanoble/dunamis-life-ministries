import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Local PC storage adapter. Keeps app data in this browser between restarts.
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value === null ? null : { key, value };
    },
    async set(key, value) {
      localStorage.setItem(key, String(value));
      return { key, value: String(value) };
    },
    async list(prefix = '') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) keys.push(key);
      }
      return { keys };
    },
    async delete(key) { localStorage.removeItem(key); }
  };
}

createRoot(document.getElementById('root')).render(<App />);
