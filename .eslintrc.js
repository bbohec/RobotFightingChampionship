module.exports = {
    globals: {
        NodeJS: true
    },
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        curly: ['error', 'multi', 'consistent'],
        indent: ['error', 4]
    },
    overrides: [
        {
            files: ['*.spec.ts'],
            rules: {
                'no-unused-expressions': 'off'
            }
        }
    ]
}
