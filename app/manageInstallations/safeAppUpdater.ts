/* eslint no-underscore-dangle: off */
import fs from 'fs';
// import * as cp from 'child_process';
import { spawn, exec, execFile } from 'child_process';

import compareVersions from 'compare-versions';
import { pushNotification } from '$Actions/launchpad_actions';
import { getCommandLineParameter } from '$Utils/app_utils';
import { notificationTypes } from '$Constants/notifications';
import { getLocalAppVersion, getInstalledLocation } from './helpers';
import {
    appHasUpdate,
    updateAppInfoIfNewer,
    resetAppUpdateState
} from '$Actions/app_manager_actions';
import { initialAppManager } from '$Reducers/initialAppManager';
import {
    isDryRun,
    isRunningOnLinux,
    isRunningOnWindows,
    isRunningOnMac,
    openAppsInDebugMode,
    useTestPackages
} from '$Constants';
import { logger } from '$Logger';

export class SafeAppUpdater {
    private _store;

    set store( store ) {
        this._store = store;
    }

    checkAppsForUpdate( application ) {
        const newVersion = application.latestVersion;
        const updateNotification = notificationTypes.UPDATE_AVAILABLE(
            application,
            newVersion
        );
        const installPath = getInstalledLocation( application );
        logger.info( `Checking for apps updates`, installPath );

        const store = this._store;

        const localVersion = getLocalAppVersion( application, store );

        if ( localVersion ) {
            const comparison = compareVersions.compare(
                newVersion,
                localVersion,
                '>'
            );

            this._store.dispatch(
                appHasUpdate( {
                    id: application.id,
                    isInstalled: true,
                    currentVersion: localVersion,
                    hasUpdate: comparison
                } )
            );

            if ( fs.existsSync( installPath ) && comparison ) {
                this._store.dispatch(
                    pushNotification( {
                        id: `${application.packageName}-update-notification`,
                        ...updateNotification
                    } )
                );
            }
        } else {
            this._store.dispatch(
                appHasUpdate( {
                    id: application.id,
                    hasUpdate: false
                } )
            );
        }
    }

    updateApplication( application ) {
        const store = this._store;

        logger.info( `Updating application: ${application}` );
        if ( isDryRun ) {
            logger.info( `DRY RUN: Not triggering update ${application}` );

            setTimeout( () => {
                store.dispatch( resetAppUpdateState( application ) );
            }, 2000 );

            return;
        }

        const appLocation = getInstalledLocation( application );
        let command = appLocation;

        const newEnvironment = {
            ...process.env,
            NODE_ENV: 'prod',
            HOT: 'false'
        };

        // needs to be actually deleted.
        delete newEnvironment.HOT;

        if ( isRunningOnMac ) {
            command = `open "${command}" -- --args --trigger-update`;

            if ( openAppsInDebugMode ) {
                command = `${command} --debug`;
            }

            logger.info( 'Opening app via path: ', command );

            if ( !isDryRun ) {
                exec( command, {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment
                } );
            }
        }

        const cmdArguments = ['--trigger-update'];

        if ( openAppsInDebugMode ) {
            cmdArguments.push( '--debug' );
        }

        if ( isRunningOnWindows ) {
            logger.info(
                'Opening on windows via execFile command: ',
                command,
                cmdArguments
            );

            if ( !isDryRun ) {
                execFile( command, [...cmdArguments], {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment
                } );
            }
        }

        if ( isRunningOnLinux ) {
            logger.warn(
                'Opening on linux via spawn command: ',
                command,
                cmdArguments
            );

            if ( !isDryRun ) {
                logger.warn( `Updating application ${application.name}` );

                // use exec for updates to retrieve info.
                const output = exec( `${command} ...cmdArguments`, {} );

                output.stderr.on( 'data', ( data ) => {
                    logger.error(
                        'Error triggering application update for ',
                        application.name
                    );
                    store.dispatch( resetAppUpdateState( application ) );
                    throw new Error( data );
                } );
            }
        }

        // lets check the app
        const TIME_TILL_UPDATE_ERROR = 900000; // ms  = 15 minutes
        const CHECK_FOR_UPDATED_VERSION_MS = 5000; // ms  = 5s
        let appHasUpdated = false;
        const targetVersion = application.latestVersion;

        let updatedCheckTimeout;
        let updatedVersion: string;

        const checkLocalVersion = setInterval( () => {
            updatedVersion = getLocalAppVersion( application, store );
            logger.info(
                'Checking for updated version of',
                application.name,
                'from',
                targetVersion,
                'to',
                updatedVersion
            );

            if (
                targetVersion &&
                updatedVersion &&
                compareVersions.compare( targetVersion, updatedVersion, '=' )
            ) {
                appHasUpdated = true;

                // we're done here!
                clearInterval( checkLocalVersion );

                if ( updatedCheckTimeout ) clearTimeout( updatedCheckTimeout );

                logger.info( 'Update successfull' );
                store.dispatch( resetAppUpdateState( application ) );
            }
        }, CHECK_FOR_UPDATED_VERSION_MS );

        updatedCheckTimeout = setTimeout( () => {
            // stop setInterval looping
            logger.verbose(
                'Clearing interval for version check for',
                application.name
            );

            clearInterval( checkLocalVersion );

            if ( !appHasUpdated ) {
                // throw error
                logger.error( 'Error, update timed out' );

                store.dispatch( resetAppUpdateState( application ) );
            }
        }, TIME_TILL_UPDATE_ERROR );
    }
}

export const safeAppUpdater = new SafeAppUpdater();
