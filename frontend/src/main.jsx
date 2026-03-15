import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const style = document.createElement('style');
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; color: #fff; -webkit-font-smoothing: antialiased; }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2) !important; }
  input:focus, textarea:focus, select:focus { border-color: rgba(251,191,36,0.4) !important; }
  select option { background: #1a1a2e; color: #fff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  button:hover { opacity: 0.85; }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)