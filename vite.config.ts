/* eslint-disable indent */
import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

const config = {
    plugins: [react()],
    root: path.resolve(__dirname, './src/ui-app/auth'),
    base: '',
    resolve: {},
    build: {
        minify: false,
        outDir: '../../public/ui-app',
        rollupOptions: {
            input: {
                // just mvp stub
                stub: path.resolve(__dirname, 'src/ui-app/index.html'),
                root: path.resolve(__dirname, 'src/ui-app/index/index.html'),
                admin: path.resolve(__dirname, 'src/ui-app/admin/index.html'),
                auth: path.resolve(__dirname, 'src/ui-app/auth/index.html'),
            },
        },
        // rollupOptions: {
        //     output: {
        //         entryFileNames: `[file].js`,
        //         chunkFileNames: `[name].js`,
        //         assetFileNames: `[name].[ext]`,
        //     },
        // },
    },
    server: {
        port: 8080,
        hot: true,
        open: '/',
    },
};

export default defineConfig(config);
