module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/*.test.(ts|js)"],
    setupFiles: ["./src/test/jestSetup.ts"],
    transform: {'\\.[jt]sx?$': ['ts-jest', { useESM: true }] },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '(.+)\\.js': '$1',
    },
  };
