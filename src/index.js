import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexRoutes from './indexRoutes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authContext';
import './css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <IndexRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
