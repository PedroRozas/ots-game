import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './theme/global.css';
import { App } from './App.tsx';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('No existe el elemento #root en el documento');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
