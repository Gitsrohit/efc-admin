import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// import { BrowserRouter } from 'react-router-dom';
import './index.css';

const root = createRoot(document.body);
root.render(<App />);