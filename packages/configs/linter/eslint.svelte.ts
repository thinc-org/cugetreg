import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import ts from "typescript-eslint";

import base from "./eslint.base.ts";

export default defineConfig(
  ...base,
  ...svelte.configs.recommended,
  ...svelte.configs.prettier,
  {
    rules: {
      semi: ["error", "always"],
    },
  },
  {
    rules: {
      // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      "svelte/no-navigation-without-resolve": "warn",
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],

    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        // svelteConfig
      },
    },
  },
  {
    ignores: [".storybook/*"],
  },
  prettier,
);
