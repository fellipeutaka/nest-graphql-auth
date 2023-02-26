import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "^@app/(.*)": "<rootDir>/src/$1",
  },
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            legacyDecorator: true,
          },
        },
      },
    ],
  },
};

export default config;
