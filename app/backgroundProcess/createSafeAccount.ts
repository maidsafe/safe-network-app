import { SafeAuthdClient, Safe } from 'safe-nodejs';
import { logger } from '$Logger';
import { setupAuthDaemon } from '$Background/authDaemon';

export const createSafeAccount = async (
    _invite: string,
    password: string,
    passphrase: string
): Promise<{ error: string }> => {
    try {
        const safeAuthdClient = await setupAuthDaemon();

        logger.info( 'Attempting to create account' );

        const safe = new Safe();
        const { sk } = safe.keys_create_preload_test_coins( '10' )[1];
        await safeAuthdClient.create_acc( sk, passphrase, password );
        logger.info( 'account created & logged in' );

        return { error: null };
    } catch ( error ) {
        logger.error(
            'Error creating account and logging in to safe authd',
            error
        );

        const errorMessage: string = error.message || '';
        // if ( errorMessage.includes( 'NoSuchLoginPacket' ) ) {
        //     errorMessage = 'Account does not exist';
        // }

        return { error: errorMessage };
    }
};
