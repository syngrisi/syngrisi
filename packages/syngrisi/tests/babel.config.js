module.exports = {
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-logical-assignment-operators',
    ],
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
            },
        }],
    ],
};
