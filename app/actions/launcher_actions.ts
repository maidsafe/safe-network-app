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
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION'
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

export const launchOnLogin = ( enable ) => {
    return new Promise( async ( resolve, reject ) => {
        const launchpadAutoLaunch = new AutoLaunch( {
            name: pkg.name
        } );
        if ( enable ) {
            launchpadAutoLaunch.enable();
            return resolve();
        }
        try {
            const isEnabled = launchpadAutoLaunch.isEnabled();
            if ( isEnabled ) {
                launchpadAutoLaunch.disable();
            }
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );
};

export const pinLaunchpadToMenu = () => {
    ipcRenderer.send( 'pinToMenuBar' );
};

export const releaseLaunchpadFromMenu = () => {
    ipcRenderer.send( 'releaseFromMenuBar' );
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

export const storeUserPreferences = ( userPreferences: UserPreferences ) =>
    storeUserPreferencesLocally( userPreferences );

export const shouldOnboard = createAliasedAction( TYPES.SHOULD_ONBOARD, () => ( {
    type: TYPES.SHOULD_ONBOARD,
    payload: checkOnBoardingCompleted().then( ( response: boolean ) => ( {
        shouldOnboard: response
    } ) )
} ) );
