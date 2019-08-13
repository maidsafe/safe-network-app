import { BrowserWindow, DownloadItem, ipcMain, app } from 'electron';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import del from 'del';
import path from 'path';
import {
    cancelAppDownloadAndInstallation,
    pauseAppDownloadAndInstallation,
    resumeAppDownloadAndInstallation,
    updateDownloadProgress,
    downloadAndInstallAppFailure
} from '$Actions/application_actions';

import { pushNotification } from '$Actions/launchpad_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';

import { silentInstall } from '$App/manageInstallations/installers';
import { unInstallApplication } from '$App/manageInstallations/uninstall';

import { logger } from '$Logger';

import { App } from '$Definitions/application.d';
import {
    DOWNLOAD_TARGET_DIR,
    INSTALL_TARGET_DIR
} from '$Constants/installConstants';

const currentDownloads = {};

const pauseDownload = ( store: Store, application: App ) => {
    logger.info( 'Pausing download...' );
    if ( !application.id ) {
        throw new Error(
            `No pending download found for application,  ${application.name}`
        );
    }

    const theCurrentDl: DownloadItem = currentDownloads[application.id];
    if ( theCurrentDl && !theCurrentDl.isPaused() ) {
        theCurrentDl.pause();
    }

    store.dispatch( pauseAppDownloadAndInstallation( application ) );
};

const resumeDownload = ( store: Store, application: App ) => {
    logger.info( 'Resuming download' );
    if ( !application.id ) {
        throw new Error(
            `No pending download found for application,  ${application.name}`
        );
    }

    const theCurrentDl: DownloadItem = currentDownloads[application.id];

    if ( theCurrentDl && theCurrentDl.canResume() ) {
        theCurrentDl.resume();
        store.dispatch( resumeAppDownloadAndInstallation( application ) );
    } else {
        // TODO throw some notification
        theCurrentDl.cancel();
        store.dispatch( cancelAppDownloadAndInstallation( application ) );
    }
};

const cancelDownload = ( store: Store, application: App ) => {
    logger.info( 'Cancelling download' );
    if ( !application.id ) {
        throw new Error(
            `No pending download found for application,  ${application.name}`
        );
    }

    const theCurrentDl: DownloadItem = currentDownloads[application.id];

    if ( theCurrentDl ) {
        theCurrentDl.cancel();
    }

    store.dispatch( cancelAppDownloadAndInstallation( application ) );
};

const getDowloadUrlForApplication = ( application: App ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.
    // TODO: perhaps use github API here...

    // should be:
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/download/v0.1.0/ElectronTypescriptBoiler-0.1.0.dmg
    // https://github.com/maidsafe/safe_browser/releases/download/v0.14.1/safe-browser-v0.14.1-linux-x64-dev.zip

    // we have: https://github.com/maidsafe/safe_browser/releases/download/v0.1.0/safe-browser-0.1.0.dmg
    const version = application.latestVersion;
    const baseUrl = `https://github.com/${application.repositoryOwner}/${
        application.repositorySlug
    }/releases/download/v${version}/${application.packageName ||
        application.name}-${version}`;
    let targetUrl: string;

    logger.silly( 'Checking platform', platform );
    switch ( platform ) {
        case MAC_OS: {
            targetUrl = `${baseUrl}.dmg`;
            break;
            // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/download/v0.1.0/ElectronTypescriptBoiler-0.1.0.dmg
        }
        case WINDOWS: {
            targetUrl = `${baseUrl}.exe`;
            break;
        }
        case LINUX: {
            // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/download/v0.1.0/electron-react-boilerplate-0.1.0-x86_64.AppImage
            targetUrl = `${baseUrl}-x86_64.AppImage`;
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

const downloadAndInstall = async (
    store: Store,
    targetWindow: BrowserWindow,
    application: App
): Promise<void> => {
    const url: string = getDowloadUrlForApplication( application );
    logger.info( 'Downloading,', application.name );

    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have downloaded ${application.name} to ${DOWNLOAD_TARGET_DIR}`
        );

        store.dispatch(
            updateDownloadProgress( {
                ...application,
                progress: 1
            } )
        );

        const fakeDlLocation = '';
        silentInstall( store, application, fakeDlLocation );
        return;
    }

    let theDownload: DownloadItem;

    const downloaderOptions = {
        directory: DOWNLOAD_TARGET_DIR,
        errorTitle: `Error Downloading ${application.name}`,
        showErrorDialog: false,
        // filename,
        onStarted: ( downloadingFile: DownloadItem ) => {
            logger.info( 'Started downloading ', application.name );

            theDownload = downloadingFile;

            // save for later
            currentDownloads[application.id] = theDownload;

            theDownload.on( 'done', ( event, state ) => {
                if ( state !== 'completed' ) {
                    logger.warn(
                        'Download done but not finished. Download state:',
                        state
                    );

                    store.dispatch(
                        cancelAppDownloadAndInstallation( application )
                    );

                    if ( currentDownloads[application.id] ) {
                        // remove tracked download item
                        delete currentDownloads[application.id];
                    }

                    return;
                }

                logger.info( 'Starting install' );
                // TODO: check hashhhhh
                const downloadLocation = theDownload.getSavePath();

                silentInstall( store, application );

                // remove tracked download item
                delete currentDownloads[application.id];
            } );
        },
        onProgress: ( progress ) => {
            store.dispatch(
                updateDownloadProgress( {
                    ...application,
                    progress
                } )
            );

            if ( progress === 1 ) {
                logger.info( 'Finshed download' );
            }
        }
    };

    try {
        // returns https://electronjs.org/docs/api/download-item
        await download( targetWindow, url, downloaderOptions );
    } catch ( error ) {
        logger.error( 'There was a DL error: ', error.message );

        const appWithError = {
            ...application,
            error: error.message
        };
        store.dispatch( downloadAndInstallAppFailure( appWithError ) );

        store.dispatch(
            pushNotification( {
                title: `Error downloading ${application.name}`,
                application,
                acceptText: 'Retry',
                type: 'RETRY_INSTALL',
                notificationType: 'standard'
            } )
        );
    }
};

export function manageDownloads( store: Store, targetWindow: BrowserWindow ) {
    console.log( 'Setting up IPC to manage downloads' );

    ipcMain.on( 'initiateDownload', ( event, application: App ) =>
        downloadAndInstall( store, targetWindow, application )
    );

    ipcMain.on( 'pauseDownload', ( event, application: App ) =>
        pauseDownload( store, application )
    );

    ipcMain.on( 'resumeDownload', ( event, application: App ) =>
        resumeDownload( store, application )
    );

    ipcMain.on( 'cancelDownload', ( event, application: App ) =>
        cancelDownload( store, application )
    );

    ipcMain.on( 'unInstallApplication', ( event, application: App ) =>
        unInstallApplication( application )
    );
}
