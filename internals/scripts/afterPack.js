#!/usr/bin/env node

// Afterpack, before sign...

const path = require( 'path' );
const fs = require( 'fs-extra' );

const pkg = require( '../../package.json' );

// const env = process.env.NODE_ENV || 'production';
// const isBuildingDev = env.startsWith( 'dev' );

const targetDirectory = path.resolve( __dirname, 'release' );

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// let PLATFORM_NAME;
let CONTAINING_FOLDER;
let APP_FOLDER;

exports.default = async function( context ) {
    // your custom code
    // const LOGS = 'log.toml';
    if ( platform === MAC_OS ) {
        CONTAINING_FOLDER = path.resolve( targetDirectory, 'mac' );
        const MAC_APP_FOLDER = path.resolve(
            CONTAINING_FOLDER,
            'SAFE Network App.app'
        );
        const APP_CONTENTS_FOLDER = path.resolve( MAC_APP_FOLDER, 'Contents' );
        CONTAINING_FOLDER = APP_CONTENTS_FOLDER;
    }

    if ( platform === LINUX ) {
        CONTAINING_FOLDER = path.resolve( targetDirectory, 'linux-unpacked' );
        APP_FOLDER = CONTAINING_FOLDER;
    }

    if ( platform === WINDOWS ) {
        CONTAINING_FOLDER = path.resolve( targetDirectory, 'win-unpacked' );
        APP_FOLDER = CONTAINING_FOLDER;
    }

    console.log( 'Creating version file here:', CONTAINING_FOLDER );
    // add version file
    fs.outputFileSync( path.resolve( CONTAINING_FOLDER, 'version' ), pkg.version );

    // remove licenses
    const removalArray = [
        'LICENSE.electron.txt',
        'LICENSES.chromium.html',
        'LICENSE'
    ];
    //
    // removalArray.forEach( ( file ) => {
    //     fs.removeSync( `${CONTAINING_FOLDER}/${file}` );
    // } );
    //
    // console.info(
    //     'Renaming package to:',
    //     path.resolve( targetDirectory, `${RELEASE_FOLDER_NAME}` )
    // );
    // // rename release folder
    // fs.moveSync(
    //     CONTAINING_FOLDER,
    //     path.resolve( targetDirectory, `${RELEASE_FOLDER_NAME}` ),
    //     { overwrite: true }
    // );
};
