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
