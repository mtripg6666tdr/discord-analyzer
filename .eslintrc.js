// eslint-disable-next-line node/no-unpublished-require
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  overrides: [
    {
      files: [
        "*.js",
      ],
      extends: [
        "@mtripg6666tdr/eslint-config/nodejs",
      ],
    },
    {
      files: [
        "./src/**/*.ts",
        "./src/**/*.tsx",
      ],
      extends: [
        "@mtripg6666tdr/eslint-config/react-typescript",
      ],
      settings: {
        react: {
          version: "detect",
        },
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  ],
};
