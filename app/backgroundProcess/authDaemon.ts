import { SafeAuthdClient, Safe } from 'safe-nodejs';
import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';

export const setupAuthDaemon = async () => {
    try {
        const safeAuthdClient = await new SafeAuthdClient(); // use default port number

        await safeAuthdClient.start( getAuthdLocation() );
        logger.info( 'Safe authd running' );
    } catch ( error ) {
        logger.error( 'Error initing safe authd', error );
    }
};

export const stopAuthDaemon = async () => {
    try {
        // TODO: we should check if we started this process
        const safeAuthdClient = await new SafeAuthdClient(); // use default port number

        await safeAuthdClient.stop( getAuthdLocation() );
        logger.info( 'Safe authd stopped' );
    } catch ( error ) {
        logger.error( 'Error stopping safe authd', error );
    }
};
