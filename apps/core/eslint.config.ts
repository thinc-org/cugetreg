import { defineConfig } from "eslint/config";

import baseHono from "@cugetreg/configs/linter/hono";

export default defineConfig(
  ...baseHono,
  {
    ignores: ["generated/"],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
