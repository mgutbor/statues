import { defineConfig } from 'eslint-define-config';
import litPlugin from 'eslint-plugin-lit';
import litA11yPlugin from 'eslint-plugin-lit-a11y';

export default defineConfig([
  {
    plugins: {
      lit: litPlugin,
      'lit-a11y': litA11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        customElements: 'readonly',
        PopStateEvent: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        // Jest globals
        describe: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        Event: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-func-assign': 'error',
      'no-prototype-builtins': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-inner-declarations': 'error',
      'no-unreachable': 'error',
      'valid-typeof': 'error',
      'no-sparse-arrays': 'error',
      // Lit recommended
      ...litPlugin.configs.recommended.rules,
      // Lit A11y rules
      ...litA11yPlugin.configs.recommended.rules,
    },
  },
]);
