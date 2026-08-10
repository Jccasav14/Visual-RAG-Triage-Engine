module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@visual-rag/shared-types$': '<rootDir>/libs/shared/types/src/index.ts',
    '^@visual-rag/redis-contract$': '<rootDir>/libs/shared/redis-contract/src/index.ts',
    '^@visual-rag/supabase$': '<rootDir>/libs/shared/supabase/src/index.ts',
    '^@visual-rag/ui-components$': '<rootDir>/libs/shared/ui-components/src/index.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.base.json' }],
  },
};
