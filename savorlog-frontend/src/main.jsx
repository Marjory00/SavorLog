// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { DndProvider } from 'react-dnd'; // <--- This import will now resolve
import { HTML5Backend } from 'react-dnd-html5-backend'; // <--- This import will now resolve

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>,
);