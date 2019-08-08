import { BrowserWindow, DownloadItem, ipcMain, app } from 'electron';
import { Store } from 'redux';
import { download } from 'electron-dl';
import { spawnSync } from 'child_process';
import del from 'del';
import dmg from 'dmg';
import path from 'path';
import { updateInstallProgress } from '$Actions/application_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';

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
    // TODO: perhaps use github API here...
    const version = application.latestVersion;
    const baseUrl = `https://github.com/${application.repositoryOwner}/${
        application.repositorySlug
    }/releases/download/v${version}/${application.packageName ||
        application.name}-${version}`;
    let targetUrl: string;

    logger.info( ' checking platform', platform );
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

const getApplicationExecutable = ( application: ManagedApplication ): string => {
    // https://github.com/joshuef/electron-typescript-react-boilerplate/releases/tag/v0.1.0
    // TODO ensure name conformity with download, or if different, note how.

    let applicationExecutable: string;

    switch ( platform ) {
        case MAC_OS: {
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

const silentInstallLinux = ( executable, downloadLocation? ) => {
    const sourceAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve( INSTALL_TARGET_DIR, executable );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have then installed to, ${installPath}` );
        return;
    }

    logger.info( 'Copying ', sourceAppPath, 'to', installPath );

    const copied = spawnSync( 'cp', [sourceAppPath, installPath] );

    if ( copied.error ) {
        logger.error( 'Error during copy', copied.error );
    }

    const installedPath = path.resolve( INSTALL_TARGET_DIR, executable );
    const makeExecutable = spawnSync( 'chmod', ['+x', installedPath] );
    if ( makeExecutable.error ) {
        logger.error( 'Error during permissions update', makeExecutable.error );
    }
    logger.info( 'Copying complete.' );
    logger.info( 'Install complete.' );
};

// https://nsis.sourceforge.io/Docs/Chapter4.html#silent
const silentInstallWindows = ( executable, downloadLocation? ) => {
    // Windows has a separate installer to the application name
    const installAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve( INSTALL_TARGET_DIR, executable );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have then installed to, ${installPath}` );
        logger.info( `DRY RUN: via command: $ ${installAppPath}` );
        return;
    }

    // isntalled lives ~/AppData/Local/Programs/safe-launch-pad/safe Launch Pad.exe
    logger.info(
        'Triggering NSIS install of ',
        installAppPath,
        'to',
        installPath,
        executable
    );

    const installer = spawnSync( installAppPath, ['/S', `/D=${installPath}`] );

    if ( installer.error ) {
        logger.error( 'Error during install', installer.error );
    }

    logger.info( 'Install complete.' );
};

const silentInstall = (
    application: ManagedApplication,
    downloadLocation?: string
) => {
    const applicationExecutable = getApplicationExecutable( application );
    switch ( platform ) {
        case MAC_OS: {
            silentInstallMacOS( applicationExecutable, downloadLocation );
            break;
        }
        case WINDOWS: {
            silentInstallWindows( applicationExecutable, downloadLocation );
            break;
        }
        case LINUX: {
            silentInstallLinux( applicationExecutable, downloadLocation );
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
    logger.info( 'Downloading, ', application.name );
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
    // TODO, check app exists first.
    logger.info( 'Starting uninstall of', application.name );

    const applicationExecutable = getApplicationExecutable( application );

    const installedPath = path.resolve(
        INSTALL_TARGET_DIR,
        applicationExecutable
    );
    const applicationUserDataPath = path.resolve(
        app.getPath( 'appData' ),
        application.name
    );

    const windowsUninstallLocation = `${INSTALL_TARGET_DIR}/${application.packageName} Uninstall.exe`;

    logger.verbose( `Attempting to remove ${installedPath}` );
    logger.verbose( `Attempting to remove ${applicationUserDataPath}` );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have uninstalled ${application.name}` );
        logger.info( `DRY RUN: from path: ${installedPath}` );
        logger.info(
            `DRY RUN: as well as userData from: ${applicationUserDataPath}`
        );
    }

    if ( platform === WINDOWS && isDryRun ) {
        logger.info(
            `DRY RUN: Would have uninstalled via command: "${windowsUninstallLocation} /S"`
        );
    }

    if ( platform === WINDOWS ) {
        const uninstalled = spawnSync( windowsUninstallLocation, ['/S'] );

        if ( uninstalled.error ) {
            logger.error( 'Error during uninstall', uninstalled.error );
        }

        // ? ALSO: ~/AppData/Local/safe-launchpad-updater

        return;
    }

    try {
        const byeApp = del( installedPath, {
            force: true,
            dryRun: isDryRun
        } );
        const byeData = del( applicationUserDataPath, {
            force: true,
            dryRun: isDryRun
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
    logger.info( 'Setting up IPC to manage downloads' );
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
