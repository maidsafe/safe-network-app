import { SafeAuthdClient } from 'safe-nodejs';

import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';
import { AuthDClient, AuthRequest } from '$Definitions/application.d';

export const setupAuthDaemon = async (): Promise<AuthDClient> => {
    const safeAuthdClient = await new SafeAuthdClient();

    try {
        await safeAuthdClient.start( getAuthdLocation() );

        logger.info( 'Safe authd running' );
    } catch ( error ) {
        if ( error.message && error.message.includes( 'AuthdAlreadyStarted' ) ) {
            logger.info( 'AuthDaemon already exists.' );
        } else {
            logger.error( 'Error initing safe authd', error );
        }
    }

    return safeAuthdClient;
};

export const stopAuthDaemon = async (): Promise<void> => {
    try {
        // TODO: we should check if we started this process
        const safeAuthdClient = await setupAuthDaemon();

        await safeAuthdClient.stop( getAuthdLocation() );
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
