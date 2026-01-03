
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures process.env is polyfilled if needed by older libs, 
    // though we are moving to import.meta.env
    'process.env': {} 
  }
});
