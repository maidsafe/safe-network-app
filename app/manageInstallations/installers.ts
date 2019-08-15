import { app } from 'electron';
import { Store } from 'redux';
import { spawnSync } from 'child_process';
import dmg from 'dmg';
import path from 'path';
import {
    downloadAndInstallAppSuccess,
    downloadAndInstallAppFailure
} from '$Actions/application_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';

import { logger } from '$Logger';
import {
    delay,
    getApplicationExecutable
} from '$App/manageInstallations/helpers';
import { App } from '$Definitions/application.d';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';

const silentInstallMacOS = (
    store,
    application,
    executablePath,
    downloadLocation?
): void => {
    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have then installed to, ${INSTALL_TARGET_DIR}/${executablePath}`
        );

        store.dispatch( downloadAndInstallAppSuccess( application ) );
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
        const targetAppPath = path.resolve( mountedPath, executablePath );

        logger.info( 'Copying ', targetAppPath, 'to', INSTALL_TARGET_DIR );

        const done = spawnSync( 'cp', ['-r', targetAppPath, INSTALL_TARGET_DIR] );

        if ( done.error ) {
            logger.error( 'Error during copy', done.error );
            store.dispatch(
                downloadAndInstallAppFailure( {
                    ...application,
                    error: done.error
                } )
            );
        }

        logger.info( 'Copying complete.' );

        dmg.unmount( mountedPath, function( unmountError ) {
            if ( unmountError ) {
                logger.error( 'Error unmounting drive', unmountError );
            }

            // TODO Remove Dlded version?
            logger.info( 'Install complete.' );
            store.dispatch( downloadAndInstallAppSuccess( application ) );
        } );
    } );
};

const silentInstallLinux = (
    store: Store,
    application: App,
    executablePath: string,
    downloadLocation?: string
) => {
    const sourceAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve( INSTALL_TARGET_DIR, executablePath );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have then installed to, ${installPath}` );

        store.dispatch( downloadAndInstallAppSuccess( application ) );
        return;
    }

    logger.info( 'Copying ', sourceAppPath, 'to', installPath );

    const copied = spawnSync( 'cp', [sourceAppPath, installPath] );

    if ( copied.error ) {
        logger.error( 'Error during copy', copied.error );
    }

    const installedPath = path.resolve( INSTALL_TARGET_DIR, executablePath );
    const makeExecutable = spawnSync( 'chmod', ['+x', installedPath] );
    if ( makeExecutable.error ) {
        logger.error( 'Error during permissions update', makeExecutable.error );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: makeExecutable.error
            } )
        );
    }
    logger.info( 'Copying complete.' );
    logger.info( 'Install complete.' );

    store.dispatch( downloadAndInstallAppSuccess( application ) );
};

// https://nsis.sourceforge.io/Docs/Chapter4.html#silent
const silentInstallWindows = (
    store: Store,
    application: App,
    executablePath: string,
    downloadLocation?: string
) => {
    // Windows has a separate installer to the application name
    const installAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve( INSTALL_TARGET_DIR, executablePath );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have then installed to, ${installPath}` );
        logger.info( `DRY RUN: via command: $ ${installAppPath}` );
        store.dispatch( downloadAndInstallAppSuccess( application ) );
        return;
    }

    // isntalled lives ~/AppData/Local/Programs/safe-launch-pad/safe Launch Pad.exe
    logger.info(
        'Triggering NSIS install of ',
        installAppPath,
        'to',
        installPath,
        executablePath
    );

    const installer = spawnSync( installAppPath, ['/S', `/D=${installPath}`] );

    if ( installer.error ) {
        logger.error( 'Error during install', installer.error );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: installer.error
            } )
        );
    }

    logger.info( 'Install complete.' );
    store.dispatch( downloadAndInstallAppSuccess( application ) );
};

export const silentInstall = async (
    store: Store,
    application: App,
    downloadLocation?: string
): Promise<void> => {
    logger.info( 'Running silent install for ', downloadLocation );

    if ( isDryRun ) {
        await delay( 4000 );
    }

    const applicationExecutable = getApplicationExecutable( application );
    switch ( platform ) {
        case MAC_OS: {
            silentInstallMacOS(
                store,
                application,
                applicationExecutable,
                downloadLocation
            );
            break;
        }
        case WINDOWS: {
            silentInstallWindows(
                store,
                application,
                applicationExecutable,
                downloadLocation
            );
            break;
        }
        case LINUX: {
            silentInstallLinux(
                store,
                application,
                applicationExecutable,
                downloadLocation
            );
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
