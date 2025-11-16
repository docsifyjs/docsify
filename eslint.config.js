import eslintConfigPrettier from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';
import js from '@eslint/js';

export default [
  // Ignore (Must be first item in array)
  {
    ignores: [
      // Directories
      '_playwright-*',
      'dist',
      'docs',
      'lib',
      'node_modules',
      // Files
      '**/*.md',
      'CHANGELOG.md',
      'emoji-data.*',
      'HISTORY.md',
    ],
  },
  // ESLint Recommended
  js.configs.recommended,
  // Configuration: Prettier
  eslintConfigPrettier,
  // All Files
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        $docsify: 'readonly',
        Docsify: 'readonly',
      },
    },
    rules: {
      'array-callback-return': ['error'],
      'block-scoped-var': ['error'],
      curly: ['error'],
      'dot-notation': ['error'],
      eqeqeq: ['error'],
      'no-implicit-coercion': ['error', { boolean: false }],
      'no-implicit-globals': ['error'],
      'no-loop-func': ['error'],
      'no-return-assign': ['error'],
      'no-template-curly-in-string': ['error'],
      'no-unneeded-ternary': ['error'],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-useless-computed-key': ['error'],
      'no-useless-return': ['error'],
      'no-var': ['error'],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
    },
  },
  // Source Files
  {
    files: ['src/**'],
    rules: {
      'no-console': ['warn'],
    },
  },
  // Tests: E2E (Playwright)
  {
    files: ['test/e2e/**'],
    ...playwrightPlugin.configs['flat/recommended'],
  },
  // Tests: Integration & Unit (Jest)
  {
    files: ['test/{integration,unit}/**'],
    ...jestPlugin.configs['flat/recommended'],
  },
];
