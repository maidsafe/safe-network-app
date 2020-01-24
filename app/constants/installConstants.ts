import path from 'path';
import os from 'os';
import { app, remote } from 'electron';

import { App } from '$Definitions/application.d';
import { LINUX, WINDOWS, platform } from '$Constants';

export const ELECTRON = 'electron';
export const BIN = 'bin';

export const DOWNLOAD_TARGET_DIR = os.tmpdir();

const homeDirectory = app ? app.getPath( 'home' ) : remote.app.getPath( 'home' );
// default to macos
let installTargetDirectory = path.resolve( '/Applications' );

if ( platform === LINUX ) {
    installTargetDirectory = path.resolve( homeDirectory, 'bin' );
}
if ( platform === WINDOWS ) {
    installTargetDirectory = path.resolve(
        homeDirectory,
        'AppData',
        'Local',
        'Programs'
    );
}

export const DESKTOP_APP_INSTALL_TARGET_DIR = installTargetDirectory;
export const getBinInstallDirectory = ( application: App ): string =>
    path.resolve( os.homedir(), '.safe/', application.packageName );
