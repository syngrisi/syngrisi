module.exports = {
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-transform-modules-commonjs',
    ],
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
            },
        }],
    ],
};
