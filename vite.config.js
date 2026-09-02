import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Caminhos relativos: essencial para o build funcionar quando aberto via
    // file:// dentro do Electron (sem isso, os assets não carregam no app desktop).
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
