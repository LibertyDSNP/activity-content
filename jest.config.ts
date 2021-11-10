// jest.config.ts
import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
};
// This prevents jest from running compiled js
// apparently it's not enough to set test root as <rootDir>/src
module.exports = {
  preset: "ts-jest",
};

export default config;
