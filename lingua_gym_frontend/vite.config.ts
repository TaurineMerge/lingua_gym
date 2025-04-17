import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import 'dotenv/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT || '3001', 10),
  },
});
