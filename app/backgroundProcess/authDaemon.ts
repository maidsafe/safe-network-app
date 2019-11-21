import sudo from 'sudo-prompt';
import { spawnSync } from 'child_process';
import { SafeAuthdClient } from 'safe-nodejs';
import { isRunningOnWindows } from '$Constants';
import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';
import { AuthDClient, AuthRequest } from '$Definitions/application.d';
import pkg from '$Package';

let windowsServiceExists = false;
let authDaemonIsRunning = false;
// let snappControllingAuthd = true;

const WIN_SUDO_OPTIONS = {
    name: pkg.productName
    // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

const installWindowsServiceIfNeeded = (
    authdLocation: string
): Promise<void> => {
    if ( !isRunningOnWindows || authDaemonIsRunning ) {
        return Promise.resolve();
    }

    // eslint-disable-next-line consistent-return
    return new Promise( ( resolve, reject ) => {
        // check if service is installed
        const serviceCheck = `Get-Service 'SAFE Authenticator'`;
        const powershell = spawnSync( 'powershell.exe', [
            '-Command',
            serviceCheck
        ] );
        if ( powershell.error ) {
            logger.error( 'Error checking services', powershell.error );

            reject( powershell.error );
        }

        logger.verbose( 'Windows service check:', powershell.stdout.toString() );
        const serviceIsInstalled = powershell.stdout
            .toString()
            .includes( 'safe-authd' );
        const serviceIsRunning = powershell.stdout
            .toString()
            .includes( 'Running' );

        windowsServiceExists = serviceIsInstalled;
        authDaemonIsRunning = serviceIsRunning;

        if ( windowsServiceExists ) {
            return resolve();
        }

        // install the service if not already
        sudo.exec( `${authdLocation} install`, WIN_SUDO_OPTIONS, function(
            error,
            stdout,
            stderr
        ) {
            if ( error ) {
                reject( error );
            } else {
                windowsServiceExists = true;
                resolve();
            }
        } );
    } );
};

export const setupAuthDaemon = async (): Promise<AuthDClient> => {
    const safeAuthdClient = await new SafeAuthdClient();
    const authdLocation = getAuthdLocation();

    await installWindowsServiceIfNeeded( authdLocation );

    try {
        if ( !authDaemonIsRunning ) {
            if ( isRunningOnWindows ) {
                sudo.exec( `${authdLocation} start`, WIN_SUDO_OPTIONS, function(
                    error
                ) {
                    if (
                        error &&
                        error.message &&
                        error.message.includes( 'AuthdAlreadyStarted' )
                    ) {
                        logger.info( 'AuthDaemon already exists.' );
                        authDaemonIsRunning = true;
                    }
                } );
            }

            await safeAuthdClient.start( getAuthdLocation() );
            authDaemonIsRunning = true;
            logger.info( 'Safe authd started' );
        }

        logger.info( 'Safe authd is running' );
    } catch ( error ) {
        if ( error.message && error.message.includes( 'AuthdAlreadyStarted' ) ) {
            logger.info( 'AuthDaemon already exists.' );
            authDaemonIsRunning = true;
        } else {
            logger.error( 'Error initing safe authd', error );
        }
    }

    return safeAuthdClient;
};

export const stopAuthDaemon = async (): Promise<void> => {
    try {
        const authdLocation = getAuthdLocation();

        // TODO: we should check if we started this process
        const safeAuthdClient = await setupAuthDaemon();

        if ( isRunningOnWindows ) {
            sudo.exec( `${authdLocation} stop`, WIN_SUDO_OPTIONS, function(
                error,
                stdout,
                stderr
            ) {
                if ( error ) throw error;
                logger.info( `stdout: ${stdout}` );
            } );
        } else {
            await safeAuthdClient.stop( getAuthdLocation() );
        }
        logger.info( 'Safe authd stopped' );
    } catch ( error ) {
        logger.error( 'Error stopping safe authd', error );
    }
};

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
