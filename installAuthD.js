const fs = require( 'fs-extra' );
const request = require( 'request' );
const rp = require( 'request-promise-native' );
const os = require( 'os' );
const path = require( 'path' );
const { exec } = require( 'child_process' );

const isRunningOnLinux = process.platform === 'linux';
const isRunningOnMac = process.platform === 'darwin';
const isRunningOnWindows = process.platform === 'win32';

const s3UrlBasis = 'https://safe-authd.s3.eu-central-1.amazonaws.com';
const s3UrlMac = `${s3UrlBasis}/mac-safe-authd`;
const s3UrlLinux = `${s3UrlBasis}/linux-safe-authd`;
const s3UrlWin = `${s3UrlBasis}/win-safe-authd.exe`;

let dlUrl = s3UrlMac;

const installTargetDirectory = path.resolve( __dirname, 'authd' );

if ( isRunningOnLinux ) {
    dlUrl = s3UrlLinux;
}
// do we install on the system? Or package w/ app?
let targetFile = path.resolve( installTargetDirectory, 'safe-authd' );

if ( isRunningOnWindows ) {
    dlUrl = s3UrlWin;
    targetFile = path.resolve( installTargetDirectory, 'safe-authd.exe' );
}

const downloadAuthD = async () => {
    fs.ensureDir( installTargetDirectory );

    try {
        const writeStream = fs.createWriteStream( targetFile, {
            mode: 0o765,
            emitClose: true
        } );
        await rp( dlUrl ).pipe( writeStream );

        // This is here incase any errors occur
        writeStream.on( 'error', function( error ) {
            console.error( 'Error downloading authd', error );

            // eslint-disable-next-line unicorn/no-process-exit
            process.exit( 1 );
        } );
        writeStream.on( 'close', function( error ) {
            // eslint-disable-next-line no-console
            console.log( 'safe-authd successfully installed' );
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit( 0 );
        } );
    } catch ( error ) {
        // eslint-disable-next-line no-console
        console.error( 'Error installing safe-authd', error );
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit( 1 );
    }
};

downloadAuthD();
