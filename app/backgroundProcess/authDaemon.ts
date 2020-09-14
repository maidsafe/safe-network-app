import { spawnSync } from 'child_process';
import { SafeAuthdClient } from 'sn_nodejs';
import fs from 'fs-extra';
import { Store } from 'redux';
import { ipcRenderer } from 'electron';

import { isRunningOnWindows } from '$Constants';
import { logger } from '$Logger';
import { AUTHD_LOCATION } from '$Constants/authd';
import { AuthDClient, AuthRequest } from '$Definitions/application.d';
import pkg from '$Package';
import { pushNotification } from '$Actions/launchpad_actions';
import { notificationTypes } from '$Constants/notifications';
import { sudoPrompt } from '$Utils/sudo-exec';

const windowsServiceExists = false;
let authDaemonIsRunning = false;
let snappControllingAuthd = false;
let theBgStore: Store;
let pendingAuthDNotificationId: string;

export const isAuthDIsInstalled = async () => {
    const exists = await fs.pathExists( AUTHD_LOCATION );
    logger.info( 'checking if authd exists here: ', AUTHD_LOCATION, exists );

    return exists;
};

export const waitForAuthDToBeInstalled = async (
    store: Store
): Promise<void> => {
    return new Promise( ( resolve, reject ) => {
        let timer;
        const markAsInstalledIfDone = async () => {
            if ( await isAuthDIsInstalled() ) {
                logger.verbose( 'awaiting authd install' );
                clearInterval( timer );
                resolve();
            }
        };

        timer = setInterval( markAsInstalledIfDone, 5000 );
    } );
};

const waitIfAuthDNotInstalled = async ( store: Store ): Promise<void> => {
    const authDIsInstalled = await isAuthDIsInstalled();

    if ( !authDIsInstalled ) {
        // if we've a store, fire a notification to install
        if ( store ) {
            theBgStore = store;
            const cliIsInstalled = store.getState().appManager.applicationList[
                'safe.cli'
            ].isInstalled;

            pendingAuthDNotificationId =
                pendingAuthDNotificationId || Math.random().toString( 36 );
            const application = {
                id: pendingAuthDNotificationId,
                name: 'Safe CLI',
            };

            const notification = notificationTypes.AUTHD_INSTALL_NEEDED();
            store.dispatch( pushNotification( notification ) );
        }
        if ( !theBgStore ) {
            logger.warn(
                'No authd and no store passed... Likely waiting on authd setup from background.ts'
            );
        }

        return waitForAuthDToBeInstalled( theBgStore );
    }

    return Promise.resolve();
};

export const setupAuthDaemon = async ( store?: Store ): Promise<AuthDClient> => {
    const authdLocation = AUTHD_LOCATION;

    const safeAuthdClient = await new SafeAuthdClient();

    await waitIfAuthDNotInstalled( store );

    try {
        if ( !authDaemonIsRunning ) {
            if ( isRunningOnWindows ) {
                try {
                    await sudoPrompt( `${authdLocation} start` );
                } catch ( error ) {
                    if (
                        error &&
                        // @ts-ignore
                        error.message &&
                        // @ts-ignore
                        error.message.includes( 'AuthdAlreadyStarted' )
                    ) {
                        logger.info( 'AuthDaemon already exists.' );
                        authDaemonIsRunning = true;
                    } else {
                        logger.error( 'Error initing authd on windows', error );
                    }
                }
            } else {
                // TODO: If no AUTHD_LOCATION bin... we need to trigger install
                await safeAuthdClient.start();
            }

            authDaemonIsRunning = true;
            snappControllingAuthd = true;

            logger.info(
                '1111Safe authd started and marked as SNAPP controlled.',
                authDaemonIsRunning
            );
        }

        logger.info( 'Safe authd is running' );
    } catch ( error ) {
        if ( error.message && error.message.includes( 'AuthdAlreadyStarted' ) ) {
            logger.info( 'AuthDaemon already exists' );
            authDaemonIsRunning = true;

            // if we're already controlling it, we can skip this on re-init
            // attempts later on.
            if ( !snappControllingAuthd ) {
                logger.info( 'Marking authd as not SNAPP controlled' );
                snappControllingAuthd = false;
            }
        } else {
            logger.error( 'Error initing safe authd', error );
        }
    }

    return safeAuthdClient;
};

// Run on main process....
export const stopAuthDaemon = async (): Promise<void> => {
    try {
        const authdLocation = AUTHD_LOCATION;

        if ( !authDaemonIsRunning ) {
            logger.warn( 'AuthDaemon is not running. Nothing to stop.' );
            return;
        }

        if ( !snappControllingAuthd ) {
            logger.warn( 'AuthDaemon is not being run by SNAPP. Will not stop.' );
            return;
        }

        // TODO: we should check if we started this process
        const safeAuthdClient = await setupAuthDaemon();

        if ( isRunningOnWindows ) {
            await sudoPrompt( `${authdLocation} stop` );
        } else {
            await safeAuthdClient.stop();
        }
        logger.info( 'Safe authd stopped' );
    } catch ( error ) {
        logger.error( 'Error stopping safe authd', error );
    }
};

// bind a listener to enable stop to be triggerfrom main process.
if ( ipcRenderer ) {
    ipcRenderer.on( 'stop-authd', stopAuthDaemon );
}

export const allowRequest = async ( request: AuthRequest ): Promise<{}> => {
    const { requestId } = request;
    logger.info( 'Attempting to allow request', requestId, typeof requestId );
    try {
        // TODO: we should check if we started this process
        const safeAuthdClient = await setupAuthDaemon();

        await safeAuthdClient.allow( parseInt( requestId, 10 ) );
        logger.info( 'Auth request allowed' );

        return request;
    } catch ( error ) {
        logger.error( 'Error allowing request w/ safe authd', error );

        return { error };
    }
};

export const denyRequest = async ( request: AuthRequest ): Promise<{}> => {
    const { requestId } = request;
    logger.info( 'Attempting to deny request', requestId, typeof requestId );
    try {
        const safeAuthdClient = await setupAuthDaemon();
        await safeAuthdClient.deny( parseInt( requestId, 10 ) );
        logger.info( 'Auth request denied' );

        return request;
    } catch ( error ) {
        logger.error( 'Error denying request w/ safe authd', error );

        return { error };
    }
};
