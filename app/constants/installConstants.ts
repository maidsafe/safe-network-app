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
    installTargetDirectory = path.resolve(
        homeDirectory,
        'safe-launcher-installed-wrongly'
    );
}

export const INSTALL_TARGET_DIR = installTargetDirectory;
