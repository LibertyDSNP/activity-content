// This prevents jest from running compiled js
// apparently it's not enough to set test root as <rootDir>/src
module.exports = {
    moduleFileExtensions: ["ts", "js", "json"],
    moduleDirectories: ["node_modules", "<rootDir>"],
    preset: "ts-jest/presets/default-esm",
    roots: ["<rootDir>"],
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", ".js"],
    testResultsProcessor: "jest-junit",
    testMatch: ["**/*.test.(ts|js)"],
    setupFiles: ["./src/test/jestSetup.ts"],
};
