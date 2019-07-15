/* eslint global-require: 1 */
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';

declare let window: Window;

const PID = process.pid;

logger.info( "Welcome to the BG process it's ID is: ", PID );

const initBgProcess = () => {
    const store = configureStore( undefined );

    // store.subscribe( () => {
    //     logger.info( 'chchchchchaaaanges' );
    // } );
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error(
        'errorInBackgroundWindow',
        JSON.stringify( error, ['message', 'arguments', 'type', 'name'] )
    );
} );
