import tseslint from "typescript-eslint";

import baseConfig from "./eslint.base.ts";

const config = [
  ...baseConfig,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      globals: {
        fetch: false,
        Response: false,
        Request: false,
        addEventListener: false,
      },

      ecmaVersion: 2021,
      sourceType: "module",
    },

    rules: {
      "no-debugger": ["error"],

      "no-empty": [
        "warn",
        {
          allowEmptyCatch: true,
        },
      ],

      "no-process-exit": "off",
      "no-useless-escape": "off",

      "prefer-const": [
        "warn",
        {
          destructuring: "all",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["arrowFunctions"],
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-var-requires": "off",

      "@typescript-eslint/no-base-to-string": [
        "error",
        {
          ignoredTypeNames: ["Error", "RegExp", "URL", "URLSearchParams"],
        },
      ],

      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allow: [{ name: ["Error", "URL", "URLSearchParams"], from: "lib" }],
          allowAny: true,
          allowBoolean: true,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: true,
        },
      ],
    },
  },
  {
    // Special rules that override eslint-config-prettier
    // See: https://github.com/prettier/eslint-config-prettier#special-rules
    rules: {
      curly: ["error", "all"],
    },
  },
];

export default config;
