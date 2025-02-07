export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/'],
  moduleNameMapper: {
      '^database/config/db-connection': '<rootDir>/src/database/config/db-connection.ts',
      '^src/utils/logger/logger': '<rootDir>/src/utils/logger/logger.ts',
  },
};