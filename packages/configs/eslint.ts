// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn"
        }
    },
    {
        ignores: [
            '**/build',
            '**/.svelte-kit',
            '**/package',
            '**/storybook-static',
            '**/dist',
        ],
    }
);

