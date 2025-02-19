/* eslint-disable indent */
import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

const config = {
    plugins: [react()],
    root: path.resolve(__dirname, './src/ui-app/'),
    // base: '',
    resolve: {
        alias: {
        },
    },
    build: {
        // tsconfig: "./vite.tsconfig.json",
        minify: true,
        sourcemap: true,
        outDir: path.resolve(__dirname, 'mvc/views/react'),
        // 'public/ui-app',
        rollupOptions: {
            input: {
                auth: path.resolve(__dirname, './src/ui-app/auth/index.html'),
                root: path.resolve(__dirname, 'src/ui-app/index2/index.html'),
                admin: path.resolve(__dirname, 'src/ui-app/admin/index.html'),
                // stub: path.resolve(__dirname, 'src/ui-app/stub.html'),
            },
        },
    },
    server: {
        port: 8080,
        hot: true,
        open: 'http://localhost:8080/',
    },
    css: {
        devSourcemap: true,
    },
    esbuild: {
        keepNames: true,
        sourcemap: true,
    },
};

export default defineConfig(config);
