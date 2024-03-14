module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/e2e/*.js',
        '**/e2e/*.ts',
        '**/__tests__/*.js',
        '**/__tests__/*.ts',
        '**/?(*.)+(spec|test).+(ts|js)',
    ],
};
