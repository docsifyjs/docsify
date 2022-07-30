const prettierConfig = require('./.prettierrc');

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended', // Must be last
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  plugins: ['prettier', 'import'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    'import/ignore': ['node_modules', '.json$'],
  },
  rules: {
    camelcase: ['warn'],
    curly: ['error', 'all'],
    'dot-notation': ['error'],
    eqeqeq: ['error'],
    'handle-callback-err': ['error'],
    'new-cap': ['error'],
    'no-alert': ['error'],
    'no-caller': ['error'],
    'no-eval': ['error'],
    'no-labels': ['error'],
    'no-lonely-if': ['error'],
    'no-new': ['error'],
    'no-proto': ['error'],
    'no-return-assign': ['error'],
    'no-self-compare': ['error'],
    'no-shadow-restricted-names': ['error'],
    'no-shadow': [
      'error',
      {
        allow: [
          'Events',
          'Fetch',
          'Lifecycle',
          'Render',
          'Router',
          'VirtualRoutes',
        ],
      },
    ],
    'no-unused-vars': ['error', { args: 'none' }],
    'no-useless-call': ['error'],
    'no-useless-escape': ['warn'],
    'no-var': ['error'],
    'no-void': ['error'],
    'no-with': ['error'],
    radix: ['error'],
    'spaced-comment': ['error', 'always'],
    strict: ['error', 'global'],
    yoda: ['error', 'never'],

    // Import rules
    // Search way how integrate with `lerna`
    'import/imports-first': ['error'],
    'import/newline-after-import': ['error'],
    'import/no-duplicates': ['error'],
    'import/no-mutable-exports': ['error'],
    'import/no-named-as-default-member': ['error'],
    'import/no-named-as-default': ['error'],
    'import/no-unresolved': 'off',
    'import/order': ['warn'],

    // Prettier (Must be last)
    'prettier/prettier': ['warn', prettierConfig],
  },
  globals: {
    $docsify: 'writable',
    Docsify: 'writable',
    dom: 'writable',
  },
};
