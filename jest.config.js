const { pathsToModuleNameMapper } = require( 'ts-jest/utils' );

const { compilerOptions } = require( './tsconfig' );

const tsConfigAlias = pathsToModuleNameMapper( compilerOptions.paths, {
    prefix: '<rootDir>/'
} );

module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-file'
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    testPathIgnorePatterns: ['node_modules', '__tests__/mock'],
    moduleDirectories: ['app', 'test', 'node_modules'],
    moduleNameMapper: {
        ...tsConfigAlias,
        '\\.(css|less|scss|sss|styl)$':
            '<rootDir>/node_modules/jest-css-modules'
    },
    globals: {
        navigator: {
            onLine: true
        },
        'ts-jest': {
            diagnostics: {
                pathRegex: '\\.(spec|test)\\.ts$'
            }
        }
    },
    setupFiles: ['<rootDir>/tests_setup.ts']
};
