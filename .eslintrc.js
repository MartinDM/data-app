// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['apps/**', 'packages/**'],
  parserOptions: {
    project: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
