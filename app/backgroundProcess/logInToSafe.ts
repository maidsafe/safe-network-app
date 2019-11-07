import { SafeAuthdClient } from 'safe-nodejs';
import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';
import { setupAuthDaemon } from '$Background/authDaemon';

export const logInToSafe = async (
    password: string,
    passphrase: string
): Promise<{ error?: string }> => {
    try {
        const safeAuthdClient = await setupAuthDaemon(); // use default port number

        await safeAuthdClient.log_in( password, passphrase );
        logger.info( 'Logged in' );

        return {};
    } catch ( error ) {
        logger.error( 'Error logging in to safe authd', error );

        let errorMessage: string = error.message || '';
        if ( errorMessage.includes( 'NoSuchLoginPacket' ) ) {
            errorMessage = 'Account does not exist';
        }

        if (
            errorMessage.includes( 'Failed to establish connection with authd' )
        ) {
            errorMessage = 'Could not connect to authenticator';
        }

        return { error: errorMessage };
    }
};
