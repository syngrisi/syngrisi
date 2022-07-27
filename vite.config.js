import * as path from 'path';
import react from '@vitejs/plugin-react';

export default {
    plugins: [react()],
    root: path.resolve(__dirname, './src/react-app'),
    base: '',
    resolve: {},
    build: {
        minify: false,
        outDir: '../../public/react-app',
        rollupOptions: {
            input: {
                // just mvp stub
                root: path.resolve(__dirname, 'src/react-app/index.html'),
                admin: path.resolve(__dirname, 'src/react-app/admin/index.html'),
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
    },
};
