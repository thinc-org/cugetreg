import { defineConfig } from 'eslint/config';

import baseSvelte from '@cugetreg/configs/linter/svelte';

export default defineConfig(
  ...baseSvelte,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
