import React from 'react';
import ReactDOM from 'react-dom/client';
import { Game } from './pages/Game';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
