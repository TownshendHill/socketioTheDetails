import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // CRA served on 3001, and the server's CORS origin expects that
    server: { port: 3001 },
});
