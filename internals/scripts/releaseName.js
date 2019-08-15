const path = require( 'path' );

const pkg = require( '../../package.json' );

const environment = process.env.NODE_ENV || 'production';
const isBuildingDevevelopment = /^(dev|test)/.test( environment );

// const targetDir = path.resolve( __dirname, 'release' );

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';
const packageName = pkg.name;

let PLATFORM_NAME;

if ( platform === MAC_OS ) {
    PLATFORM_NAME = 'mac';
}

if ( platform === LINUX ) {
    PLATFORM_NAME = LINUX;
}

if ( platform === WINDOWS ) {
    PLATFORM_NAME = 'win';
}

// let developmentModifier = '';
// if ( isBuildingDevevelopment ) {
//     developmentModifier = '-dev';
// }

const RELEASE_FOLDER_NAME = `${PLATFORM_NAME}`;

module.exports = { RELEASE_FOLDER_NAME };
