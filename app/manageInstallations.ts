import { BrowserWindow, DownloadItem, ipcMain, app } from 'electron';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import del from 'del';
import dmg from 'dmg';
import path from 'path';
import { updateInstallProgress } from '$Actions/application_actions';
import { OSX, LINUX, WINDOWS, isDryRun, platform } from '$Constants';

import { logger } from '$Logger';

import { ManagedApplication } from '$Definitions/application.d';
import {
    DOWNLOAD_TARGET_DIR,
    INSTALL_TARGET_DIR
} from '$Constants/installConstants';

const getDowloadUrlForApplication = (
    application: ManagedApplication
): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.
    const version = application.latestVersion;
    const baseUrl: string = `${
        application.repository
    }/releases/download/v${version}/${application.packageName ||
        application.name}-${version}`;
    let targetUrl: string;

    logger.info( ' checking platform', platform );
    switch ( platform ) {
        case OSX: {
            targetUrl = `${baseUrl}.dmg`;
            break;
            // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/download/v0.1.0/ElectronTypescriptBoiler-0.1.0.dmg
        }
        case WINDOWS: {
            targetUrl = `${baseUrl}.nsis`;
            break;
        }
        case LINUX: {
            // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/download/v0.1.0/electron-react-boilerplate-0.1.0-x86_64.AppImage
            targetUrl = `${baseUrl}.-x86_64.AppImage`;
            break;
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
    logger.verbose( 'Download URL: ', targetUrl );
    return targetUrl;
};

const getApplicationExecutable = ( application: ManagedApplication ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.

    let applicationExecutable: string;

    switch ( platform ) {
        case OSX: {
            applicationExecutable = `${application.packageName ||
                application.name}.app`;
            break;
        }
        case WINDOWS: {
            applicationExecutable = `${application.packageName ||
                application.name}.exe`;
            break;
        }
        case LINUX: {
            applicationExecutable = `${application.packageName ||
                application.name}.AppImage`;
            break;
            // electron-react-boilerplate-0.1.0-x86_64.AppImage
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
    logger.verbose( 'Executable is called: ', applicationExecutable );
    return applicationExecutable;
};

const silentInstallMacOS = ( executable, downloadLocation? ) => {
    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have then installed to, ${INSTALL_TARGET_DIR}/${executable}`
        );
        return;
    }

    // path must be absolute and the extension must be .dmg
    dmg.mount( downloadLocation, async ( error, mountedPath ) => {
        if ( error ) {
            logger.error(
                'Problem mounting the dmg for install of: ',
                downloadLocation
            );
            logger.error( error );
        }
        const targetAppPath = path.resolve( mountedPath, executable );

        logger.info( 'Copying ', targetAppPath, 'to', INSTALL_TARGET_DIR );

        const done = spawnSync( 'cp', ['-r', targetAppPath, INSTALL_TARGET_DIR] );

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

const silentInstall = (
    application: ManagedApplication,
    downloadLocation?: string
) => {
    const applicationExecutable = getApplicationExecutable( application );
    switch ( platform ) {
        case OSX: {
            silentInstallMacOS( applicationExecutable, downloadLocation );
            break;
        }
        case WINDOWS: {
            logger.warn( 'No windows install func yet, sorry!' );
            break;
        }
        case LINUX: {
            logger.warn( 'No linux install func yet, sorry!' );
            break;
        }
        default: {
            logger.error(
                'Unsupported platform for desktop applications:',
                platform
            );
        }
    }
};

const downloadAndInstall = async (
    store: Store,
    targetWindow: BrowserWindow,
    application: ManagedApplication
): Promise<void> => {
    const url: string = getDowloadUrlForApplication( application );

    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have downloaded ${
                application.name
            } to ${DOWNLOAD_TARGET_DIR}`
        );

        store.dispatch(
            updateInstallProgress( {
                ...application,
                progress: 1
            } )
        );

        const fakeDlLocation = '';
        silentInstall( application, fakeDlLocation );
        return;
    }

    let theDownload: DownloadItem;

    const downloaderOptions = {
        directory: DOWNLOAD_TARGET_DIR,
        // filename,
        onStarted: ( downloadingFile: DownloadItem ) => {
            logger.info( 'Started downloading ', application );

            theDownload = downloadingFile;

            theDownload.on( 'done', ( event, state ) => {
                if ( state !== 'completed' ) {
                    logger.info(
                        'Download done but not finished. Downlaod state:',
                        state
                    );
                    return;
                }

                logger.info( 'Starting install' );
                // TODO: check hashhhhh
                const downloadLocation = theDownload.getSavePath();

                silentInstall( application );
            } );
        },
        onProgress: ( progress ) => {
            store.dispatch(
                updateInstallProgress( {
                    // todo, pull from app
                    name: 'SAFE Browser',
                    progress,
                    type: 'userApplications'
                } )
            );

            if ( progress === 1 ) {
                logger.info( 'Finshed download' );
            }
        }
    };

    // returns https://electronjs.org/docs/api/download-item
    download( targetWindow, url, downloaderOptions );
};

const uninstallApplication = async ( application: ManagedApplication ) => {
    const applicationExecutable = getApplicationExecutable( application );

    const installedPath = path.resolve(
        INSTALL_TARGET_DIR,
        applicationExecutable
    );
    const applicationUserDataPath = path.resolve(
        app.getPath( 'appData' ),
        application.name
    );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have uninstalled ${application.name}` );
        logger.info( `DRY RUN: from path: ${installedPath}` );
        logger.info(
            `DRY RUN: as well as userData from: ${applicationUserDataPath}`
        );
    }

    // TODO all platforms;
    try {
        // TODO dont force dryrun
        const byeApp = del( installedPath, {
            force: true,
            dryRun: true
        } );
        const byeData = del( applicationUserDataPath, {
            force: true,
            dryRun: true
        } );
        await Promise.all( [byeApp, byeData] );

        if ( isDryRun ) {
            logger.info( `uninstalled:`, byeApp );
            logger.info( `uninstalled:`, byeData );
        }
    } catch ( error ) {
        logger.error( 'Error deleting the application: ', application );
        logger.error( error );
    }
};

export function manageDownloads( store: Store, targetWindow: BrowserWindow ) {
    // setup event
    ipcMain.on( 'initiateDownload', ( event, application: ManagedApplication ) =>
        downloadAndInstall( store, targetWindow, application )
    );
    // TODO: Specify full app / type
    ipcMain.on(
        'uninstallApplication',
        ( event, application: ManagedApplication ) =>
            uninstallApplication( application )
    );
}
