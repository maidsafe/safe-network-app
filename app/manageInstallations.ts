import { BrowserWindow, DownloadItem, ipcMain, app } from 'electron';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import del from 'del';
import dmg from 'dmg';
import path from 'path';
import { updateInstallProgress } from '$Actions/application_actions';

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
    INSTALL_TARGET_DIR,
    INSTALLED_APP
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

            // TODO Remove Dlded version?
            logger.info( 'Install complete.' );
        } );
    } );
};

const downloadAndInstall = async (
    store: Store,
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
        onProgress: ( progress ) => {
            // logger.verbose( prog );

            store.dispatch(
                updateInstallProgress( {
                    // todo, pull from app
                    name: 'SAFE Browser',
                    progress,
                    type: 'userApplications'
                } )
            );

            if ( progress === 1 ) {
                logger.info( 'FINISHHEDDDD DOWNLOAD' );
                logger.info( 'starting install' );
            }
        }
    };

    // returns https://electronjs.org/docs/api/download-item
    download( targetWindow, url, downloaderOptions );
};

const uninstallApplication = async ( application: string ) => {
    // TODO all platforms;
    try {
        const byeApp = del( INSTALLED_APP, { force: true, dryRun: true } );
        const byeData = del( app.getPath( 'userData' ), {
            force: true,
            dryRun: true
        } );
        await Promise.all( [byeApp, byeData] );

        console.log( 'byeApp', byeApp );
        console.log( 'byeData', byeData );
    } catch ( error ) {
        logger.error( 'Error deleting the application: ', application );
        logger.error( error );
    }
};

export function manageDownloads( store: Store, targetWindow: BrowserWindow ) {
    // setup event
    ipcMain.on( 'initiateDownload', ( event, application: string ) =>
        downloadAndInstall( store, targetWindow, application )
    );
    // TODO: Specify full app / type
    ipcMain.on( 'uninstallApplication', ( event, application: string ) =>
        uninstallApplication( application )
    );
}
