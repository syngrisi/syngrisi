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
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-optional-catch-binding',
        '@babel/plugin-transform-runtime',
    ],
    env: {
        development: {
            sourceMaps: 'inline',
            plugins: ['source-map-support'],
        },
    },
    comments: false,
};
