import { BrowserWindow, DownloadItem, ipcMain, shell } from 'electron';
import { spawn, spawnSync, exec, execFile } from 'child_process';
import path from 'path';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { I18n } from 'react-redux-i18n';
import fs from 'fs-extra';

import { getInstalledLocation } from '$App/manageInstallations/helpers';
import { getMaidsafeS3Folder } from '$App/utils/getMaidsafeS3Folder';
import {
    cancelAppDownloadAndInstallation,
    pauseAppDownloadAndInstallation,
    resumeAppDownloadAndInstallation,
    updateDownloadProgress,
    downloadAndInstallAppFailure,
} from '$Actions/application_actions';
import { pushNotification } from '$Actions/launchpad_actions';
import {
    RELEASE_CHANNEL,
    ALPHA,
    BETA,
    MAC_OS,
    LINUX,
    WINDOWS,
    isDryRun,
    platform,
    isRunningOnMac,
    isRunningOnLinux,
    isRunningOnWindows,
    openAppsInDebugMode,
} from '$Constants';
import { NOTIFICATION_TYPES } from '$Constants/notifications';
import { silentInstall } from '$App/manageInstallations/installers';
import { unInstallApplication } from '$App/manageInstallations/uninstall';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';
import {
    DOWNLOAD_TARGET_DIR,
    DESKTOP_APP_INSTALL_TARGET_DIR,
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

const getArtifactName = ( application: App ): string => {
    let name;
    switch ( platform ) {
        case MAC_OS: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-mac/sn_browser-v0.15.1-mac-x64.dmg
            // targetUrl = `${baseUrl}/${packageName}-${version}-mac-x64.dmg`;
            name = application.artifactTemplate.mac.replace(
                '<version>',
                application.latestVersion
            );
            break;
        }
        case WINDOWS: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-win/sn_browser-v0.15.1-win-x64.exe
            name = application.artifactTemplate.windows.replace(
                '<version>',
                application.latestVersion
            );
            // name = packageName}-${version}-win-x64.exe`;
            break;
        }
        case LINUX: {
            // https://sn-browser.s3.eu-west-2.amazonaws.com/sn_browser-linux/sn_browser-v0.15.1-linux-x64.AppImage
            name = application.artifactTemplate.linux.replace(
                '<version>',
                application.latestVersion
            );
            // name = `${baseUrl}/${packageName}-${version}-linux-x64.AppImage`;
            break;
        }
        default:
            name = '';
    }
    return name;
};

const getDowloadUrlForApplication = ( application: App ): string => {
    const version = application.latestVersion;
    const { packageName } = application;
    const baseUrl = application.baseUrl || getMaidsafeS3Folder( application );

    const theApp = { ...application };
    // let targetUrl: string;

    logger.silly( 'Checking platform for download', platform, application );

    if ( !application.latestVersion ) {
        theApp.latestVersion = application.currentVersion;
    }

    const targetUrl = `${baseUrl}/${getArtifactName( theApp )}`;

    logger.info( 'Download URL: ', targetUrl );
    return targetUrl;
};

const downloadAndInstall = async (
    store: Store,
    targetWindow: BrowserWindow,
    application: App
): Promise<void> => {
    const url: string = getDowloadUrlForApplication( application );
    logger.info( 'Downloading,', application.name, 'from', url );

    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have downloaded ${application.name} to ${DOWNLOAD_TARGET_DIR}`
        );

        store.dispatch(
            updateDownloadProgress( {
                ...application,
                progress: 1,
            } )
        );

        const fakeDlLocation = '';
        silentInstall( store, application, fakeDlLocation );
        return;
    }

    let theDownload: DownloadItem;

    const downloadPath = path.resolve(
        DOWNLOAD_TARGET_DIR,
        getArtifactName( application )
    );

    if ( await fs.pathExists( downloadPath ) ) {
        logger.info(
            'Path already exists, using previous download.',
            downloadPath
        );
        // skip download
        // TODO: check if we're trying....
        silentInstall( store, application, downloadPath );
        return;
    }

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

                silentInstall( store, application, downloadLocation );

                // remove tracked download item
                delete currentDownloads[application.id];
            } );
        },
        onProgress: ( progress ) => {
            store.dispatch(
                updateDownloadProgress( {
                    ...application,
                    progress,
                } )
            );

            if ( progress === 1 ) {
                logger.info( 'Finshed download' );
            }
        },
    };

    try {
        // returns https://electronjs.org/docs/api/download-item
        await download( targetWindow, url, downloaderOptions );
    } catch ( error ) {
        logger.error( 'There was a DL error: ', error );

        const appWithError = {
            ...application,
            error: error.message,
        };
        store.dispatch( downloadAndInstallAppFailure( appWithError ) );

        // remove broken dl
        spawnSync( 'rm', ['-rf', downloadPath] );
        store.dispatch(
            pushNotification( {
                title: `Error downloading ${application.name}`,
                application,
                acceptText: 'Retry',
                type: 'RETRY_INSTALL',
                notificationType: NOTIFICATION_TYPES.STANDARD,
            } )
        );
    }
};

export function manageDownloads( store: Store, targetWindow: BrowserWindow ) {
    logger.info( 'Setting up IPC to manage downloads' );

    ipcMain.on( 'initiateDownload', ( event, application: App ) =>
        // TODO. Here determine app type... naming convention...
        // target location....
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
        unInstallApplication( store, application )
    );

    ipcMain.on( 'openApplication', ( event, application: App ) => {
        const appLocation = getInstalledLocation( application );

        let command = appLocation;

        const newEnvironment = {
            ...process.env,
            NODE_ENV: 'prod',
            HOT: 'false',
        };
        // needs to be actually deleted.
        delete newEnvironment.HOT;

        logger.warn( 'Opening app via path: ', command );

        if ( isRunningOnMac ) {
            command = openAppsInDebugMode
                ? `open "${command}" -- --args --debug`
                : `open "${command}"`;

            exec( command, {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                env: newEnvironment,
            } );
        }
        if ( isRunningOnWindows ) {
            if ( openAppsInDebugMode ) {
                execFile( command, ['--debug'], {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment,
                } );
                return;
            }
            execFile( command, {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                env: newEnvironment,
            } );
            return;
        }
        if ( isRunningOnLinux ) {
            logger.warn( 'Opening on linux via spawn command: ', command );
            // exec on linux doesnt give us a new process, so closing SNAPP
            // will close the spawned app :|

            if ( openAppsInDebugMode ) {
                spawn( command, ['--debug'], {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment,
                    detached: true,
                } );
            } else {
                spawn( command, {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment,
                    detached: true,
                } );
            }
        }
    } );
}
