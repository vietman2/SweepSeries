const tseslint = require("typescript-eslint");
const globals = require("globals");
const react = require("eslint-plugin-react");

module.exports = [
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    ignores: ["**/*.d.ts", "**/*.config.js", "node_modules/**"],
    plugins: { react },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      semi: "error",
    },
  },
  ...tseslint.configs.recommended,
];
