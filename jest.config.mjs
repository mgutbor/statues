export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.mjs" }]
  },
  moduleFileExtensions: ["js", "json"],
  roots: ["<rootDir>/src/test"],
  transformIgnorePatterns: [
    "/node_modules/(?!@open-wc|@esm-bundle)"
  ]
};