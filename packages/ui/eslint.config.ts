import { fileURLToPath } from "node:url";

import { defineConfig } from "eslint/config";

import baseSvelte from "@cugetreg/configs/linter/svelte";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(
  ...baseSvelte,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
  },
);
