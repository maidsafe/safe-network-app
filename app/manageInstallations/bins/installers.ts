import { app } from 'electron';
import unzipper from 'unzipper';
import { spawnSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { Store } from 'redux';

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
import { getBinInstallDirectory } from '$Constants/installConstants';

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

        switch ( platform ) {
            case MAC_OS: {
                spawnSync( 'chmod', [
                    '+x',
                    path.resolve( binInstallTarget, application.binName.mac )
                ] );
                spawn( application.postInstall.mac, {
                    env: process.env,
                    shell: true
                } );
                break;
            }
            case WINDOWS: {
                // TODO: how to do this on windows
                // spawnSync( 'chmod', ['+x', path.resolve(binInstallTarget, application.binName.windows)] );
                spawn( application.postInstall.windows, {
                    env: process.env,
                    shell: true
                } );
                break;
            }
            case LINUX: {
                spawnSync( 'chmod', [
                    '+x',
                    path.resolve( binInstallTarget, application.binName.linux )
                ] );
                spawn( application.postInstall.linux, {
                    env: process.env,
                    shell: true
                } );
                break;
            }
            default:
                break;
        }

        logger.info( 'Install complete.' );
        store.dispatch( downloadAndInstallAppSuccess( application ) );
    } catch ( error ) {
        logger.error( `Error Unzipping ${downloadLocation}`, error );
        spawnSync( 'rm', ['-rf', downloadLocation] );
        store.dispatch(
            downloadAndInstallAppFailure( {
                ...application,
                error: `Error unzipping ${downloadLocation}, or running postInstall script.`
            } )
        );
    }
};
