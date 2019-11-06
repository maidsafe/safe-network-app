/* eslint global-require: 1 */
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import { logger } from '$Logger';
import { setCurrentStoreForNotificationActions } from '$Actions/alias/notification_actions';
import { configureStore } from '$Store/configureStore';
import { setCurrentStore } from '$Actions/application_actions';
import { settingsHandler } from '$Actions/helpers/settings_handler';
import { isDryRun } from '$Constants';

import {
    setupAuthDaemon,
    stopAuthDaemon,
    subscribeForAuthRequests
} from '$App/backgroundProcess/authDaemon';

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

const initBgProcess = () => {
    const store = configureStore( undefined );
    setCurrentStore( store );
    setCurrentStoreForNotificationActions( store );
    store.subscribe( () => {
        managePreferencesLocally( store );
    } );

    setupAuthDaemon();
    subscribeForAuthRequests();
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error( 'errorInBackgroundWindow', error );
} );
