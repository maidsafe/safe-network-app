import { app } from 'electron';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { Store } from 'redux';
import dmg from 'dmg';

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
import { DESKTOP_APP_INSTALL_TARGET_DIR } from '$Constants/installConstants';

export const silentInstallAppOnMacOS = (
    store: Store,
    application: App,
    executablePath: string,
    downloadLocation?: string
): void => {
    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have then installed to, ${DESKTOP_APP_INSTALL_TARGET_DIR}/${executablePath}`
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

        logger.info(
            'Copying ',
            targetAppPath,
            'to',
            DESKTOP_APP_INSTALL_TARGET_DIR
        );

        await fs.ensureDir( DESKTOP_APP_INSTALL_TARGET_DIR );
        const done = spawnSync( 'cp', [
            '-r',
            targetAppPath,
            DESKTOP_APP_INSTALL_TARGET_DIR
        ] );

        const doneError = done.error || done.stderr.toString();
        if ( doneError ) {
            logger.error( 'Error during copy', doneError );
            store.dispatch(
                downloadAndInstallAppFailure( {
                    ...application,
                    error: doneError
                } )
            );

            spawnSync( 'rm', ['-rf', downloadLocation] );
        }

        if ( !doneError ) {
            logger.info( 'Copying complete.' );
        }

        dmg.unmount( mountedPath, function( unmountError ) {
            if ( unmountError ) {
                logger.error( 'Error unmounting drive', unmountError );
            }

            if ( !doneError ) {
                logger.info( 'Install complete.' );
                store.dispatch( downloadAndInstallAppSuccess( application ) );
            }
        } );
    } );
};

export const silentInstallAppOnLinux = async (
    store: Store,
    application: App,
    executablePath: string,
    downloadLocation?: string
) => {
    const sourceAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve(
        DESKTOP_APP_INSTALL_TARGET_DIR,
        executablePath
    );

    if ( isDryRun ) {
        logger.info( `DRY RUN: Would have then installed to, ${installPath}` );

        store.dispatch( downloadAndInstallAppSuccess( application ) );
        return;
    }

    logger.info( 'Copying ', sourceAppPath, 'to', installPath );
    await fs.ensureDir( DESKTOP_APP_INSTALL_TARGET_DIR );
    const copied = spawnSync( 'cp', [sourceAppPath, installPath] );

    if ( copied.error ) {
        logger.error( 'Error during copy', copied.error );
    }

    const installedPath = path.resolve(
        DESKTOP_APP_INSTALL_TARGET_DIR,
        executablePath
    );
    const makeExecutable = spawnSync( 'chmod', ['+x', installedPath] );
    if ( makeExecutable.error ) {
        logger.error( 'Error during permissions update', makeExecutable.error );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: makeExecutable.error
            } )
        );
        spawnSync( 'rm', ['-rf', downloadLocation] );
    }
    logger.info( 'Copying complete.' );
    logger.info( 'Install complete.' );

    store.dispatch( downloadAndInstallAppSuccess( application ) );
};

// https://nsis.sourceforge.io/Docs/Chapter4.html#silent
export const silentInstallAppOnWindows = async (
    store: Store,
    application: App,
    downloadLocation?: string
): Promise<null> => {
    // Windows has a separate installer to the application name
    const installAppPath = path.resolve( downloadLocation );
    const installPath = path.resolve(
        DESKTOP_APP_INSTALL_TARGET_DIR,
        `${application.name || application.packageName}`
    );

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
        installPath
    );

    await fs.ensureDir( DESKTOP_APP_INSTALL_TARGET_DIR );
    const installer = spawnSync( installAppPath, ['/S', `/D=${installPath}`] );

    if ( installer.error ) {
        logger.error( 'Error during install', installer.error );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: installer.error
            } )
        );

        spawnSync( 'rm', ['-rf', downloadLocation] );
    }

    logger.info( 'Install complete.' );
    store.dispatch( downloadAndInstallAppSuccess( application ) );
};
