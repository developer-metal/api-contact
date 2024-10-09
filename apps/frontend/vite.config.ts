import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    cors: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3500',
        changeOrigin: true
      },
      '/bff/v1': {
        target: process.env.HOST_BFF_BACKEND,
        changeOrigin: true
      }
    }
  }
});