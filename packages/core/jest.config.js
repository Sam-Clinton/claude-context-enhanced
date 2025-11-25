module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.ts',
        '**/?(*.)+(spec|test).ts'
    ],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/index.ts'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageDirectory: 'coverage',
    verbose: true,
    testTimeout: 30000, // 30 seconds for integration tests
    // Setup files if needed
    // setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
