import { BrowserWindow, DownloadItem, ipcMain, app } from 'electron';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import del from 'del';
import path from 'path';
import { updateInstallProgress } from '$Actions/application_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';

import { silentInstall } from '$App/manageInstallations/installers';
import { uninstallApplication } from '$App/manageInstallations/uninstall';

import { logger } from '$Logger';

import { App } from '$Definitions/application.d';
import {
    DOWNLOAD_TARGET_DIR,
    INSTALL_TARGET_DIR
} from '$Constants/installConstants';

const currentDownloads = {};

const getDowloadUrlForApplication = ( application: App ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.
    // TODO: perhaps use github API here...
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
            updateInstallProgress( {
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
        // filename,
        onStarted: ( downloadingFile: DownloadItem ) => {
            logger.info( 'Started downloading ', application.name );

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

                silentInstall( store, application );
            } );
        },
        onProgress: ( progress ) => {
            store.dispatch(
                updateInstallProgress( {
                    ...application,
                    progress
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

export function manageDownloads( store: Store, targetWindow: BrowserWindow ) {
    console.log( 'Setting up IPC to manage downloads' );
    // setup event
    ipcMain.on( 'initiateDownload', ( event, application: App ) =>
        downloadAndInstall( store, targetWindow, application )
    );

    // TODO: Specify full app / type
    ipcMain.on( 'uninstallApplication', ( event, application: App ) =>
        uninstallApplication( application )
    );
}
