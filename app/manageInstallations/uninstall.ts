import { app } from 'electron';

import { spawnSync } from 'child_process';
import del from 'del';
import path from 'path';

import { MAC_OS, LINUX, WINDOWS, isDryRun, platform } from '$Constants';
import { getApplicationExecutable } from '$App/manageInstallations/helpers';

import { logger } from '$Logger';

import { App } from '$Definitions/application.d';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';

export const uninstallApplication = async ( application: App ): Promise<void> => {
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
