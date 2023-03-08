// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  collectCoverageFrom: ['**/*.js', '!jest.config.js', '!coverage/**/*.js'],

  modulePathIgnorePatterns: [
    '<rootDir>/.*/__mocks__',
    'commitlint.config.js',
    '<rootDir>/.*/schemas'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node'
};
