/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/src'],
  modulePaths: ['<rootDir>', '<rootDir>/src'],
  moduleDirectories: ['node_modules'],
};
