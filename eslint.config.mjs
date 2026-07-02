// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    '**/.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'storybook-static/**',
    '**/storybook-static/**',
    '.claude/**',
  ]),
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '__tests__/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]);

export default eslintConfig;
