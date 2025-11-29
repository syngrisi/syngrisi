module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'plugins': [
        '@typescript-eslint',
        'custom'
    ],
    'rules': {
        'custom/validate-request-rule': 'error',
        'custom/check-route-registration': 'error',
        'custom/test-rule': 'off'
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                '@typescript-eslint/no-var-requires': 'error',
            },
        },
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
