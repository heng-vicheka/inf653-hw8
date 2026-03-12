import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. JS-specific config: Put the recommended rules INSIDE here
  {
    files: ['**/*.{js,mjs,cjs}'],
    // This spreads the recommended rules ONLY for these files
    ...js.configs.recommended,
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
    },
  },

  // 2. CSS config (KEEP THIS SEPARATE)
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    // Notice: no js.configs.recommended here!
  },

  // 3. JSON & Markdown (KEEP THESE SEPARATE)
  { files: ['**/*.json'], plugins: { json }, language: 'json/json' },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
  },

  prettierConfig,
]);
