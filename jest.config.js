const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/src/mocks/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "\\.(scss)$": "identity-obj-proxy",
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
  },
  transform: {
    "\\.tsx?$": "ts-jest",
  },
};
