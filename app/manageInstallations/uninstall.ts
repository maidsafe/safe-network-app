import { app } from 'electron';
import { Store } from 'redux';

import { spawnSync } from 'child_process';
import del from 'del';
import path from 'path';
import { I18n } from 'react-redux-i18n';

import { pushNotification } from '$Actions/launchpad_actions';
import {
    uninstallAppPending,
    uninstallAppFailure,
    uninstallAppSuccess
} from '$Actions/application_actions';
import { NOTIFICATION_TYPES } from '$Constants/notifications';
import { isRunningOnMac, isRunningOnWindows, isDryRun } from '$Constants';
import {
    delay,
    getApplicationExecutable,
    getInstalledLocation
} from '$App/manageInstallations/helpers';

import { logger } from '$Logger';

import { App } from '$Definitions/application.d';
import { INSTALL_TARGET_DIR } from '$Constants/installConstants';

export const unInstallApplication = async (
    store: Store,
    application: App
): Promise<void> => {
    // TODO, check app exists first.
    logger.info( 'Starting uninstall of', application.name );

    store.dispatch( uninstallAppPending( application ) );

    const installedPath = getInstalledLocation( application );
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

    if ( isRunningOnWindows ) {
        if ( isDryRun )
            logger.info(
                `DRY RUN: Would have uninstalled via command: "${windowsUninstallLocation} /S"`
            );
        else {
            const uninstalled = spawnSync( windowsUninstallLocation, ['/S'] );

            if ( uninstalled.error ) {
                logger.error( 'Error during uninstall', uninstalled.error );
            }

            // ? ALSO: ~/AppData/Local/safe-launchpad-updater

            return;
        }
    }

    try {
        if ( isRunningOnMac ) {
            logger.verbose( 'Attempting to delete .asar files' );
            const asarLocation = `${installedPath}/Contents/Resources`;
            if ( isDryRun ) {
                await delay( 500 );
                logger.verbose(
                    `MacOS, first would have removed: ${asarLocation}/electron.asar`
                );
                logger.verbose(
                    `MacOS, first would have removed: ${asarLocation}/app.asar`
                );
            }

            // we need to manually remove .asar files _first_.
            const done = spawnSync( 'rm', [
                `${asarLocation}/electron.asar`,
                `${asarLocation}/app.asar`
            ] );

            if ( done.error ) {
                logger.error( 'Error during removal of .asar files', done.error );
                store.dispatch(
                    pushNotification( {
                        title: I18n.t(
                            'notifications.title.uninstall_error_asar',
                            {
                                asarLocation
                            }
                        ),
                        message: done.error.message,
                        application,
                        type: 'UNINSTALL_FAIL',
                        notificationType: NOTIFICATION_TYPES.STANDARD
                    } )
                );
            }
        }
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
            await delay( 500 );

            logger.info( `uninstalled:`, byeApp );
            logger.info( `uninstalled:`, byeData );
        }
        store.dispatch( uninstallAppSuccess( application ) );
    } catch ( error ) {
        logger.error( 'Error deleting the application: ', application.name );
        logger.error( error );

        const appWithError = { ...application, error: error.message };

        store.dispatch( uninstallAppFailure( appWithError ) );
        store.dispatch(
            pushNotification( {
                title: I18n.t( 'notifications.title.uninstall_error', {
                    name: application.name
                } ),
                message: error.message,
                application,
                // acceptText: 'Dismiss',
                type: 'UNINSTALL_FAIL',
                notificationType: NOTIFICATION_TYPES.STANDARD
            } )
        );
    }
};
