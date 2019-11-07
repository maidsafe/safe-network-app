import { Store } from 'redux';
import getPort from 'get-port';
import { setupAuthDaemon } from '$Background/authDaemon';
import { LAUNCHPAD_APP_ID } from '$Constants';
import { addAuthRequestToPendingList } from '$Actions/alias/authd_actions';

import { logger } from '$Logger';

let theAuthDaemonWithSubscription;

let theBgStore: Store;

export const setCurrentStoreForAuthDSubscriber = ( passedStore: Store ) => {
    theBgStore = passedStore;
};

const handleAuthDSubscriptionCallbacks = (
    appId: string,
    requestId: string
): void => {
    logger.info( 'Auth request received', appId, requestId );

    if ( !theBgStore ) {
        throw Error( 'Auth Request received before store was setup' );
    }

    theBgStore.dispatch(
        addAuthRequestToPendingList( {
            appId,
            requestId
        } )
    );
};

export const subscribeForAuthRequests = async (): Promise<void> => {
    try {
        // TODO: if presubbed, use a new port... or just use randoooo
        // TODO: we should check if we started this process
        const PORT = '33001';

        const availablePort = await getPort();

        const subscribeServer = `https://localhost:${availablePort}`;
        theAuthDaemonWithSubscription = await setupAuthDaemon();

        logger.info(
            'Attempting to subscibe for auth requests on port',
            availablePort
        );
        await theAuthDaemonWithSubscription.subscribe(
            subscribeServer,
            LAUNCHPAD_APP_ID,
            handleAuthDSubscriptionCallbacks
        );
        logger.info( 'Subscibed successfully on port', availablePort );
    } catch ( error ) {
        logger.error( 'Error subscribing to safe authd', error );
    }
};
