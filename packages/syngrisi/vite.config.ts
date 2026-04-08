/* eslint-disable indent */
import { defineConfig, type Plugin } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

// Custom plugin to rewrite root path to index2/index.html in dev mode
const devRootRewrite = (): Plugin => ({
    name: 'dev-root-rewrite',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            // Redirect /admin and /auth to add trailing slash (for correct relative path resolution)
            if (req.url === '/admin') {
                res.writeHead(301, { Location: '/admin/' });
                res.end();
                return;
            }
            if (req.url === '/auth') {
                res.writeHead(301, { Location: '/auth/' });
                res.end();
                return;
            }
            // Handle admin and auth routes explicitly
            if (req.url === '/admin/') {
                req.url = '/admin/index.html';
            }
            if (req.url === '/auth/') {
                req.url = '/auth/index.html';
            }
            // Rewrite root path and SPA routes to index2/index.html
            if (req.url === '/' || req.url === '/index.html') {
                req.url = '/index2/index.html';
            } else if (
                req.url &&
                !req.url.startsWith('/index2/') &&
                !req.url.startsWith('/admin/') &&
                !req.url.startsWith('/auth/') &&
                !req.url.startsWith('/v1/') &&
                !req.url.startsWith('/@') && // vite internal
                !req.url.startsWith('/node_modules/') &&
                !req.url.startsWith('/src/') &&
                !req.url.includes('.') // not a file with extension
            ) {
                // SPA fallback: rewrite other paths without extension to index2/index.html
                req.url = '/index2/index.html';
            }
            next();
        });
    },
    transformIndexHtml(html, ctx) {
        if (ctx.path.includes('index2') || ctx.filename.includes('index2')) {
            return html.replace(/src="\.?\/main\.tsx"/, 'src="/index2/main.tsx"');
        }
        return html;
    },
});

const config = {
    plugins: [react(), devRootRewrite()],
    root: path.resolve(__dirname, './src/ui-app/'),
    // base: '',
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, './src/ui-app/shared'),
            '@hooks': path.resolve(__dirname, './src/ui-app/index2/hooks'),
            '@index': path.resolve(__dirname, './src/ui-app/index2'),
            '@admin': path.resolve(__dirname, './src/ui-app/admin'),
            '@auth': path.resolve(__dirname, './src/ui-app/auth'),
            '@asserts': path.resolve(__dirname, './src/ui-app/asserts'),
            '@config': path.resolve(__dirname, './src/ui-app/config.ts'),
            '@shared/lib': path.resolve(__dirname, './src/ui-app/shared/lib'),
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
        port: 4000,
        hot: true,
        open: '/',
        proxy: {
            '/v1': 'http://localhost:3000',
            '/swagger': 'http://localhost:3000',
            '/snapshoots': 'http://localhost:3000',
            '/static': 'http://localhost:3000',
            '/assets': 'http://localhost:3000',
            '/ai': 'http://localhost:3000',
        },
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
