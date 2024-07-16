// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import CSSBaseline from '@mui/material/CssBaseline';
import ThemeProvider from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <CSSBaseline />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
