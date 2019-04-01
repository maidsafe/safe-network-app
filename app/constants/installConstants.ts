import path from 'path';
import { app } from 'electron';
import { OSX, LINUX, WINDOWS, platform } from '$Constants';

export const DOWNLOAD_TARGET_DIR = path.resolve(
    app.getPath( 'userData' ),
    'downloads'
);
const SAFE_BROWSER_MAC =
    'https://github.com/joshuef/safe_browser/releases/download/v0.1.0/safe-browser-0.1.0.dmg';
const SAFE_BROWSER_LINUX =
    'https://github.com/maidsafe/safe_browser/releases/download/v0.12.0/safe-browser-v0.12.0-linux-x64.zip';
const SAFE_BROWSER_WINDOWS =
    'https://github.com/maidsafe/safe_browser/releases/download/v0.12.0/safe-browser-v0.12.0-win-x64.zip';

const homeDirectory = app.getPath( 'home' );
// default to macos
let installTargetDirectory = path.resolve( '/Applications' );
let browserDownloadUrl = SAFE_BROWSER_MAC;
let browserApplicationName = 'safe-browser-v0.12.0-osx-x64/SAFE Browser.app/';

if ( platform === LINUX ) {
    browserApplicationName = 'safe-browser-v0.12.0-linux-x64';
    browserDownloadUrl = SAFE_BROWSER_LINUX;
    installTargetDirectory = path.resolve( homeDirectory, 'bin' );
}
if ( platform === WINDOWS ) {
    browserApplicationName = 'safe-browser-v0.12.0-win-x64';
    browserDownloadUrl = SAFE_BROWSER_WINDOWS;
    installTargetDirectory = path.resolve(
        homeDirectory,
        'safe-launcher-installed-wrongly'
    );
}

export const INSTALL_TARGET_DIR = installTargetDirectory;
export const BROWSER_URL = browserDownloadUrl;
export const BROWSER_APPLICATION_NAME = browserApplicationName;

export const APPLICATIONS = {
    BROWSER: 'browser'
};
