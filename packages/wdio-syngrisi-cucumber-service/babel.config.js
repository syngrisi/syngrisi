module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 14,
            },
            useBuiltIns: false,
        }],
    ],
    plugins: [
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-catch-binding',
        '@babel/transform-runtime',
    ],
    env: {
        development: {
            sourceMaps: 'inline',
            plugins: ['source-map-support'],
        },
    },
    comments: false,
};
