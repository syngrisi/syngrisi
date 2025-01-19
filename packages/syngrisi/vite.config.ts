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
        minify: false,
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
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        // Split node_modules into separate chunks
                        return 'vendor';
                    }
                    // Keep source files separate
                    return path.parse(id).name;
                },
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
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
