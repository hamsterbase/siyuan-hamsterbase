import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/siyuan-proxy': {
        target: 'http://127.0.0.1:6806',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/siyuan-proxy/, ''),
      },
    },
  },
});
