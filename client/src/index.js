import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/media-queries.css';
import './css/button.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App tab="home" />);