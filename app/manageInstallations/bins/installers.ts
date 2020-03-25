import { app } from 'electron';
import unzipper from 'unzipper';
import { spawnSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { Store } from 'redux';

import { sudoPrompt } from '$Utils/sudo-exec';
import { AUTHD_LOCATION } from '$Constants/authd';
import {
    downloadAndInstallAppSuccess,
    downloadAndInstallAppFailure,
} from '$Actions/application_actions';
import { setAsInstalled } from '$Actions/alias/authd_actions';
import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';
import { logger } from '$Logger';
import {
    delay,
    getApplicationExecutable,
} from '$App/manageInstallations/helpers';
import { App } from '$Definitions/application.d';
import { getBinInstallDirectory } from '$Constants/installConstants';
import pkg from '$Package';

const WIN_SUDO_OPTIONS = {
    name: pkg.productName,
    // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

export const silentInstallBin = async (
    store: Store,
    application: App,
    // executablePath: string,
    downloadLocation?: string
): Promise<void> => {
    const binInstallTarget = getBinInstallDirectory( application );
    if ( isDryRun ) {
        logger.info(
            `DRY RUN: Would have then installed to, ${binInstallTarget}`
        );
        logger.info(
            `DRY RUN: Would have then run command, ${application.postInstall}`
        );

        store.dispatch( downloadAndInstallAppSuccess( application ) );
        return;
    }

    try {
        logger.info( `Unzipping ${downloadLocation}` );
        const directory = await unzipper.Open.file( downloadLocation );
        await directory.extract( { path: binInstallTarget } );
        logger.info( 'unzipped' );
        switch ( platform ) {
            case MAC_OS: {
                spawnSync( 'chmod', [
                    '+x',
                    path.resolve( binInstallTarget, application.binName.mac ),
                ] );
                logger.info(
                    'About to run binscript:',
                    application.postInstall.mac
                );
                spawnSync( application.postInstall.mac, {
                    env: process.env,
                    shell: true,
                } );
                break;
            }
            case WINDOWS: {
                // TODO: how to do this on windows
                spawnSync( 'chmod', [
                    '+x',
                    path.resolve( binInstallTarget, application.binName.windows ),
                ] );
                logger.info(
                    'About to run binscript:',
                    application.postInstall.windows
                );
                // install the service if not already
                await sudoPrompt( application.postInstall.windows );

                break;
            }
            case LINUX: {
                spawnSync( 'chmod', [
                    '+x',
                    path.resolve( binInstallTarget, application.binName.linux ),
                ] );
                spawnSync( application.postInstall.linux, {
                    env: process.env,
                    shell: true,
                } );
                break;
            }
            default:
                break;
        }

        logger.info( 'Bin Install complete.' );
        store.dispatch( downloadAndInstallAppSuccess( application ) );

        // Handle special case of authd install
        if ( application.id === 'safe.cli' ) {
            let timer;
            const markAsInstalledIfDone = async () => {
                if ( await fs.pathExists( AUTHD_LOCATION ) ) {
                    store.dispatch( setAsInstalled() );
                    clearInterval( timer );
                }
            };

            timer = setInterval( markAsInstalledIfDone, 500 );
        }
    } catch ( error ) {
        logger.error( `Error at unzip and install ${downloadLocation}`, error );
        spawnSync( 'rm', ['-rf', downloadLocation] );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: `Error unzipping ${downloadLocation}, or running postInstall script.`,
            } )
        );
    }
};
