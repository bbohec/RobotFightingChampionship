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
        indent: ['error', 4],
        curly: ['error', 'multi', 'consistent']
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
