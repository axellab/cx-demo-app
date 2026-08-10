import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Rutas relativas: la demo tiene que poder servirse desde un subdirectorio
  // (GitHub Pages) sin recompilar.
  base: './',
  server: {
    host: true, // permite abrirla desde el celular en la misma red
  },
});
