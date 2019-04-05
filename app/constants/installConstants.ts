import path from 'path';
import { app } from 'electron';
import { LINUX, WINDOWS, platform } from '$Constants';

export const DOWNLOAD_TARGET_DIR = path.resolve(
    app.getPath( 'userData' ),
    'downloads'
);

const homeDirectory = app.getPath( 'home' );
// default to macos
let installTargetDirectory = path.resolve( '/Applications' );

if ( platform === LINUX ) {
    installTargetDirectory = path.resolve( homeDirectory, 'bin' );
}
if ( platform === WINDOWS ) {
    //  ~/AppData/Local/Programs/safe-launch-pad/safe Launch Pad.exe
    installTargetDirectory = path.resolve( homeDirectory, 'Local', 'Programs' );
}

export const INSTALL_TARGET_DIR = installTargetDirectory;
