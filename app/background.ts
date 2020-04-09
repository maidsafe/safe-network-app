/* eslint global-require: 1 */
import _ from 'lodash';
import { Store } from 'redux';

import { logger } from '$Logger';
import { setCurrentStoreForNotificationActions } from '$Actions/alias/notification_actions';
import { configureStore } from '$Store/configureStore';
import { setCurrentStore } from '$Actions/application_actions';
import { settingsHandler } from '$Actions/helpers/settings_handler';
import {
    isAuthDIsInstalled,
    setupAuthDaemon,
    waitForAuthDToBeInstalled,
} from '$App/backgroundProcess/authDaemon';
import {
    subscribeForAuthRequests,
    setCurrentStoreForAuthDSubscriber,
} from '$App/backgroundProcess/authDaemonSubscription';
import { setAsInstalled } from '$Actions/alias/authd_actions';

declare let window: Window;

const PID = process.pid;

logger.info( `Welcome to the BG process it's ID is: `, PID );

function getStatePreferences( state ) {
    const userPreferences = { ...state.launchpad.userPreferences };
    const appPreferences = { ...state.launchpad.appPreferences };
    const preferences = { appPreferences, userPreferences };
    return preferences;
}

const managePreferencesLocally = async ( store ) => {
    const previousState = await settingsHandler.getPreferences();
    const currentState = getStatePreferences( store.getState() );
    if ( !_.isEqual( previousState, currentState ) ) {
        await settingsHandler.updatePreferences( { ...currentState } );
    }
};

const initBgProcess = async () => {
    const store: Store = configureStore( undefined );
    setCurrentStore( store );
    setCurrentStoreForAuthDSubscriber( store );
    setCurrentStoreForNotificationActions( store );
    store.subscribe( () => {
        managePreferencesLocally( store );
    } );

    if ( await isAuthDIsInstalled() ) {
        store.dispatch( setAsInstalled() );
    }

    await setupAuthDaemon( store );
    subscribeForAuthRequests( store );
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error( 'errorInBackgroundWindow', error );
} );
