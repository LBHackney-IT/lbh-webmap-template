/* eslint-env node */
const baseConfig = require("./.eslintrc");
const parserOptions = { ...baseConfig.parserOptions };
const overrides = [...baseConfig.overrides];

module.exports = {
  extends: ["./.eslintrc.js"],
  parserOptions,
  overrides
};
