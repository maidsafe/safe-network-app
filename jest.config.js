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
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    testPathIgnorePatterns: ['node_modules'],
    moduleDirectories: ['app', 'test', 'node_modules'],
    moduleNameMapper: {
        ...tsConfigAlias,
        '\\.(css|less|scss|sss|styl)$':
            '<rootDir>/node_modules/jest-css-modules'
    },
    globals: {
        'ts-jest': {
            diagnostics: {
                pathRegex: '\\.(spec|test)\\.ts$'
            }
        }
    },
    setupFiles: ['<rootDir>/tests_setup.ts']
};
