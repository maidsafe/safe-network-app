import { SafeAuthdClient, Safe } from 'safe-nodejs';
import { logger } from '$Logger';
import { getAuthdLocation } from '$Constants/authd';
import { LAUNCHPAD_APP_ID } from '$Constants';

let theAuthDaemonWithSubscription;

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

export const allowRequest = async ( requestId: number ) => {
    try {
        // TODO: we should check if we started this process
        const safeAuthdClient = await new SafeAuthdClient(); // use default port number

        logger.info( 'Attempting to allow request', requestId );
        await safeAuthdClient.allow( requestId );
        logger.info( 'Auth request allowed' );
    } catch ( error ) {
        logger.error( 'Error allowing request w/ safe authd', error );
    }
};

export const denyRequest = async ( requestId: number ) => {
    try {
        // TODO: we should check if we started this process
        const safeAuthdClient = await new SafeAuthdClient(); // use default port number

        logger.info( 'Attempting to deny request', requestId );
        await safeAuthdClient.deny( requestId );
        logger.info( 'Auth request denied' );
    } catch ( error ) {
        logger.error( 'Error denying request w/ safe authd', error );
    }
};

const handleAuthDSubscriptionCallbacks = ( appId, requestId ) => {
    logger.info( 'Auth request received', appId, requestId );

    console.log( ' REQ RECEIVEDDDD', appId, requestId );
    // store.dispatch( requestinfo )

    setTimeout( () => {
        allowRequest( parseInt( requestId, 10 ) );
    }, 5000 );
};

export const subscribeForAuthRequests = async () => {
    try {
        // TODO: we should check if we started this process
        theAuthDaemonWithSubscription = await new SafeAuthdClient(); // use default port number

        logger.info( 'Attempting to subscibe for auth requests' );
        await theAuthDaemonWithSubscription.subscribe(
            'https://localhost:33001',
            LAUNCHPAD_APP_ID,
            handleAuthDSubscriptionCallbacks
        );
        logger.info( 'Subscibed successfully' );
    } catch ( error ) {
        logger.error( 'Error subscribing to safe authd', error );
    }
};
