import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@firebase/installations'] // इसे pre-bundle से बाहर करो
  },
  build: {
    rollupOptions: {
      external: ['@firebase/installations'] // bundle में include मत करो
    }
  }
});
