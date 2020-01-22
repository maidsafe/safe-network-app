const fs = require( 'fs-extra' );
const unzipper = require( 'unzipper' );
const request = require( 'request' );
const os = require( 'os' );
const path = require( 'path' );
const { exec } = require( 'child_process' );

const isRunningOnLinux = process.platform === 'linux';
const isRunningOnMac = process.platform === 'darwin';
const isRunningOnWindows = process.platform === 'win32';

// https://safe-api.s3.eu-west-2.amazonaws.com/safe-authd-0.0.1-x86_64-apple-darwin.zip
const AUTHD_VERSION = '0.0.2';
const s3UrlBasis = `https://safe-api.s3.eu-west-2.amazonaws.com/safe-authd-${AUTHD_VERSION}-x86_64`;
const s3UrlMac = `${s3UrlBasis}-apple-darwin.zip`;
const s3UrlLinux = `${s3UrlBasis}-unknown-linux-gnu.zip`;
const s3UrlWin = `${s3UrlBasis}-pc-windows-gnu.zip`;

let dlUrl = s3UrlMac;

const installTargetDirectory = path.resolve( __dirname, 'authd' );

if ( isRunningOnLinux ) {
    dlUrl = s3UrlLinux;
}
if ( isRunningOnWindows ) {
    dlUrl = s3UrlWin;
}
// do we install on the system? Or package w/ app?
// const targetZipFile = path.resolve( installTargetDirectory, 'authd.zip' );

let targetFile = path.resolve( installTargetDirectory, 'safe-authd' );

if ( isRunningOnWindows ) {
    targetFile = path.resolve( installTargetDirectory, 'safe-authd.exe' );
}

async function main() {
    const directory = await unzipper.Open.url( request, dlUrl );
    directory.files.forEach( async ( d ) => {
        const content = await d.buffer();
        fs.outputFile( targetFile, content, {
            mode: 0o765
        } );
    } );
}

try {
    main();
    console.log("AuthD successfully installed.")
} catch ( theError ) {
    console.error( 'Error downloading safe-auth or unzipping', theError.message );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit( 1 );
}
