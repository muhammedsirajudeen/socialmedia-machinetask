const eslintPluginPrettier = require("eslint-plugin-prettier");
const eslintPluginTS = require("@typescript-eslint/eslint-plugin");
const eslintParserTS = require("@typescript-eslint/parser");

/** @type {import("eslint").Linter.Config} */
module.exports = [
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: eslintParserTS,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": eslintPluginTS,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "prettier/prettier": "off",
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],

    },
  },
];
