import { ipcRenderer } from 'electron';
import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import AutoLaunch from 'auto-launch';
import pkg from '$Package';

import { userPreferenceDatabase } from './helpers/user_preferences_db';
import { UserPreferences } from '../definitions/application.d';

export const TYPES = {
    SHOULD_ONBOARD: 'SHOULD_ONBOARD',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    ALIAS_STORE_USER_PREFERENCES: 'ALIAS_STORE_USER_PREFERENCES',
    ALIAS_AUTO_LAUNCH: 'ALIAS_AUTO_LAUNCH',
    ALIAS_PIN_TO_TRAY: 'ALIAS_PIN_TO_TRAY'
};

export const mockPromise = ( data = null ) =>
    new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve( data );
        }, 1000 );
    } );

const fetchUserPreferencesLocally = () =>
    new Promise( async ( resolve, reject ) => {
        try {
            let [userPreferences] = await userPreferenceDatabase.getAll();

            if ( !userPreferences ) {
                await userPreferenceDatabase.setup();
                [userPreferences] = await userPreferenceDatabase.getAll();
            }
            delete userPreferences.id;
            return resolve( userPreferences );
        } catch ( error ) {
            return reject( error );
        }
    } );

const storeUserPreferencesLocally = ( userPreferences: UserPreferences ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            if ( !userPreferenceDatabase.canUpdate() ) {
                await userPreferenceDatabase.init();
            }
            await userPreferenceDatabase.updatePreferences( userPreferences );
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );

const checkOnBoardingCompleted = () => mockPromise( true );

const autoLaunchOnStart = ( enable ) =>
    new Promise( async ( resolve ) => {
        try {
            const launchpadAutoLaunch = new AutoLaunch( {
                name: pkg.name
            } );
            const isEnabled = await launchpadAutoLaunch.isEnabled();
            if ( !isEnabled && enable ) {
                await launchpadAutoLaunch.enable();
                return resolve();
            }

            if ( isEnabled ) {
                await launchpadAutoLaunch.disable();
            }
            return resolve();
        } catch ( error ) {
            // TODO: Show error notification
            console.log( 'Unable to process the request', error );
            return resolve();
        }
    } );

const pinLaunchpadToTray = ( enable ) => {
    if ( enable ) {
        ipcRenderer.send( 'pinToTray' );
    } else {
        ipcRenderer.send( 'releaseFromTray' );
    }
};

export const {
    pushNotification,
    dismissNotification,
    setUserPreferences
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES
);

export const getUserPreferences = () => {
    return ( dispatch ) => {
        return fetchUserPreferencesLocally().then(
            ( userPreferences: UserPreferences ) =>
                dispatch( setUserPreferences( userPreferences ) )
        );
    };
};

export const storeUserPreferences = createAliasedAction(
    TYPES.ALIAS_STORE_USER_PREFERENCES,
    ( userPreferences: UserPreferences ) => ( {
        type: TYPES.ALIAS_STORE_USER_PREFERENCES,
        payload: storeUserPreferencesLocally( userPreferences )
    } )
);

export const shouldOnboard = createAliasedAction( TYPES.SHOULD_ONBOARD, () => ( {
    type: TYPES.SHOULD_ONBOARD,
    payload: checkOnBoardingCompleted().then( ( response: boolean ) => ( {
        shouldOnboard: response
    } ) )
} ) );

export const autoLaunch = createAliasedAction(
    TYPES.ALIAS_AUTO_LAUNCH,
    ( enable ) => ( {
        type: TYPES.ALIAS_AUTO_LAUNCH,
        payload: autoLaunchOnStart( enable )
    } )
);

export const pinToTray = createAliasedAction(
    TYPES.ALIAS_PIN_TO_TRAY,
    ( enable ) => ( {
        type: TYPES.ALIAS_PIN_TO_TRAY,
        payload: pinLaunchpadToTray( enable )
    } )
);
