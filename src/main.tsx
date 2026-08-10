import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// El orden importa: los imports de CSS se evalúan en este orden y así queda la
// cascada. Tienen que ir ANTES de App, porque si no las hojas que App importa
// se inyectan primero y las reglas base terminan pisando a las de pantalla.
import './styles/global.css';
import './styles/components.css';
import './styles/screens.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
