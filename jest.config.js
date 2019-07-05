// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     testURL: 'http://localhost/',
//     verbose: true,
//     moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
//     setupFiles: ['raf/polyfill', '<rootDir>/tests_setup.js'],
//     testPathIgnorePatterns: ['node_modules'],
//     moduleDirectories: ['app', 'test', 'node_modules'],
//     moduleNameMapper: {
//         '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
//             '<rootDir>/mocks/fileMock.ts',
//         '\\.(css|less|scss)$': '<rootDir>/mocks/fileMock.ts',
//         '^spectron-lib(.*)$': '<rootDir>/__e2e__/lib$1'
//     }
// };

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
