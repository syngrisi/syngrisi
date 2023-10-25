module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'unicorn'],
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings'
    ],
    env: {
        node: true,
        es6: true,
        jest: true
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module'
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        indent: [2, 4],

        'no-constant-condition': 0,
        // see https://stackoverflow.com/questions/55280555/typescript-eslint-eslint-plugin-error-route-is-defined-but-never-used-no-un
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        'import/no-unresolved': 0,
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,

        'unicorn/prefer-node-protocol': ['error']
    },
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                'no-undef': 'off'
            }
        }
    ]
}
