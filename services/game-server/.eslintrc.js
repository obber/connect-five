const { resolve } = require("node:path");

const project = resolve(
  // Using `__dirname__` here ensures that we resolve the path for the tsconfig
  // file inside of this app.
  __dirname,
  "./tsconfig.json"
);

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  extends: ["@c5/custom/library"],
  rules: {
    "@typescript-eslint/no-extraneous-class": "off",
  },
};
