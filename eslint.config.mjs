import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'storybook-static/**']),
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '__tests__/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
]);

export default eslintConfig;
