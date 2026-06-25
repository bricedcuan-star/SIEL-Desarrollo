import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
  // Forzamos a Vite a buscar el router en src/router
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
