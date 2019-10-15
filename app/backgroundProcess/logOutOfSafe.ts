import { SafeAuthdClient } from 'safe-nodejs';
import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';

export const logOutOfSafe = async () => {
    try {
        const safeAuthdClient = await new SafeAuthdClient(); // use default port number

        await safeAuthdClient.start( getAuthdLocation() );
        await safeAuthdClient.log_out();
        logger.info( 'Logged out' );

        return { isLoggedIn: false, error: null };
    } catch ( error ) {
        logger.error( 'Error logging out of safe authd', error );

        const errorMessage: string = error.message || '';

        return { isLoggedIn: true, error: errorMessage };
    }
};
