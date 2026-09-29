import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // 1. Dossiers ignorés
  {
    ignores: ['dist/**', 'node_modules/**']
  },

  // 2. Configurations de base recommandées
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Configuration principale pour vos fichiers TypeScript & JavaScript
  {
    files: ['src/**/*.ts', 'src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      curly: ['error', 'multi', 'consistent'],
      indent: ['error', 4],
      '@typescript-eslint/no-unnecessary-condition': 'warn'
    }
  },

  // 4. Adaptation pour les fichiers de tests (*.spec.ts) pour Chai / Mocha
  {
    files: ['src/**/*.spec.ts'],
    rules: {
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
);