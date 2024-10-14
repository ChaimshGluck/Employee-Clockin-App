import React from 'react';
import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/media-queries.css';
import './css/button.css';
import App from './App';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);