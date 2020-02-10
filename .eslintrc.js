/* eslint-env node */
const sharedPlugins = ["prettier"];
const sharedExtends = ["eslint:recommended"];
const sharedPrettierExtends = ["prettier"];

module.exports = {
  plugins: [...sharedPlugins],
  extends: [...sharedExtends, ...sharedPrettierExtends],
  rules: {},
  settings: {
    react: {
      version: "detect"
    }
  },
  overrides: [
    {
      files: ["**/*.js"],
      plugins: [...sharedPlugins],
      extends: [...sharedExtends, ...sharedPrettierExtends]
    }
  ]
};
