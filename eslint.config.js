import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{ts,js}'],
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'allure-results/',
      'allure-report/',
      'test-results/',
      'playwright-report/',
      '*.config.js',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Reglas básicas de JavaScript
      ...js.configs.recommended.rules,

      // Reglas de TypeScript
      ...tsPlugin.configs.recommended.rules,

      // Reglas de Prettier
      'prettier/prettier': 'error',

      // Reglas personalizadas para testing
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Reglas de calidad de código
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',

      // Reglas específicas para tests
      'no-magic-numbers': 'off', // Los tests suelen tener números mágicos
      'max-lines-per-function': 'off', // Los tests pueden ser largos
      'max-len': ['warn', { code: 120, ignoreComments: true }],
    },
  },
  {
    // Configuración específica para archivos de configuración
    files: ['*.config.{ts,js}', 'playwright.config.ts'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
  {
    // Configuración específica para archivos de test
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-console': 'off', // Permitir console.log en tests
      '@typescript-eslint/no-explicit-any': 'off', // Tests pueden usar any
    },
  },
];
