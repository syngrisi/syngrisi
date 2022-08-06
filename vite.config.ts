/* eslint-disable indent */
import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

const config = {
    plugins: [react()],
    root: path.resolve(__dirname, process.env.VITE_ROOT_PATH || './src/ui-app/auth'),
    base: '',
    resolve: {},
    build: {
        minify: false,
        outDir: path.resolve(__dirname, 'mvc/views/react'),
        // 'public/ui-app',
        rollupOptions: {
            input: {
                // just mvp stub
                auth: path.resolve(__dirname, 'src/ui-app/auth/index.html'),
                // root: path.resolve(__dirname, 'src/ui-app/index/index.html'),
                // admin: path.resolve(__dirname, 'src/ui-app/admin/index.html'),
                // stub: path.resolve(__dirname, 'src/ui-app/stub.html'),
            },
        },
    },
    server: {
        port: 8080,
        hot: true,
        open: 'http://localhost:8080',
    },
};

export default defineConfig(config);
