import { BrowserWindow, DownloadItem, ipcMain } from 'electron';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import dmg from 'dmg';
import path from 'path';
import { logger } from '$Logger';
// import {
//     isRunningUnpacked,
//     isRunningDebug,
//     isRunningSpectronTestProcess,
//     isRunningDevelopment,
//     isCI
// } from '$Constants';

import {
    APPLICATIONS,
    BROWSER_URL,
    DOWNLOAD_TARGET_DIR,
    INSTALL_TARGET_DIR
} from '$Constants/installConstants';

const silentInstallMacOS = ( downloadLocation ) => {
    // path must be absolute and the extension must be .dmg
    dmg.mount( downloadLocation, async ( error, mountedPath ) => {
        if ( error ) {
            logger.error(
                'Problem mounting the dmg for install of: ',
                downloadLocation
            );
            logger.error( error );
        }
        const targetApp = path.resolve( mountedPath, 'SAFE Browser.app' );

        logger.info( 'Copying ', targetApp, 'to', INSTALL_TARGET_DIR );

        const done = spawnSync( 'cp', ['-r', targetApp, INSTALL_TARGET_DIR] );

        if ( done.error ) {
            logger.error( 'Error during copy', done.error );
        }

        logger.info( 'Copying complete.' );

        dmg.unmount( mountedPath, function( unmountError ) {
            if ( unmountError ) {
                logger.error( 'Error unmounting drive', unmountError );
            }

            logger.info( 'Install complete.' );
        } );
    } );
};

const BACKGROUND_PROCESS = `file://${__dirname}/bg.html`;

const downloadAndInstall = async (
    targetWindow: BrowserWindow,
    application: string
): Promise<void> => {
    let url: string;

    if ( application === APPLICATIONS.BROWSER ) {
        url = BROWSER_URL;
    }

    let theDownload: DownloadItem;

    const downloaderOptions = {
        directory: DOWNLOAD_TARGET_DIR,
        // filename,
        onStarted: ( downloadingFile: DownloadItem ) => {
            logger.verbose( 'Started downloading ', application );

            theDownload = downloadingFile;

            theDownload.on( 'done', ( event, state ) => {
                if ( state !== 'completed' ) {
                    logger.info( 'DID NOT FINISH', state );
                    return;
                }

                // TODO: check hashhhhh
                const downloadLocation = theDownload.getSavePath();

                silentInstallMacOS( downloadLocation );
            } );
        },
        onProgress: ( prog ) => {
            logger.verbose( prog );

            if ( prog === 1 ) {
                logger.info( 'FINISHHEDDDD DOWNLOAD' );
                logger.info( 'starting install' );
            }
        }
    };

    // returns https://electronjs.org/docs/api/download-item
    download( targetWindow, url, downloaderOptions );
};

export function manageDownloads( targetWindow: BrowserWindow ) {
    // setup event
    ipcMain.on( 'initiateDownload', ( event, application: string ) =>
        downloadAndInstall( targetWindow, application )
    );
}
