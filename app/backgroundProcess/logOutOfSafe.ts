import { SafeAuthdClient } from 'sn_nodejs';

import { logger } from '$Logger';
import { setupAuthDaemon } from '$Background/authDaemon';

export const logOutOfSafe = async () => {
    try {
        const safeAuthdClient = await setupAuthDaemon(); // use default port number
        await safeAuthdClient.log_out();
        logger.info( 'Logged out' );

        return { isLoggedIn: false, error: null };
    } catch ( error ) {
        logger.error( 'Error logging out of safe authd', error );

        const errorMessage: string = error.message || '';

        return { isLoggedIn: true, error: errorMessage };
    }
};
