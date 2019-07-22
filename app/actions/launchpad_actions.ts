import { createActions } from 'redux-actions';

import { UserPreferences, AppPreferences } from '$Definitions/application.d';
import {
    initiliseApplication,
    fetchUserPreferencesLocally,
    storeAppPreferencesLocally,
    fetchAppPreferencesLocally
} from './helpers/launchpad';

import { pinToTray } from './alias/launchpad_actions';

export const TYPES = {
    INITILISE_APP: 'INITILISE_APP',
    ONBOARD_COMPLETED: 'ONBOARD_COMPLETED',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
    SET_APP_PREFERENCES: 'SET_APP_PREFERENCES'
};

export const {
    pushNotification,
    dismissNotification,
    setUserPreferences,
    setAppPreferences
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES,
    TYPES.SET_APP_PREFERENCES
);

export const getUserPreferences = () => {
    return ( dispatch ) => {
        return fetchUserPreferencesLocally().then(
            ( userPreferences: UserPreferences ) =>
                dispatch( setUserPreferences( userPreferences ) )
        );
    };
};

export const setOnboardCompleted = () => {
    return ( dispatch ) => {
        const appPreferences: AppPreferences = {
            shouldOnboard: false
        };
        return storeAppPreferencesLocally( appPreferences ).finally(
            dispatch( {
                type: TYPES.ONBOARD_COMPLETED
            } )
        );
    };
};

export const initialiseApp = () => {
    return async ( dispatch ) => {
        await initiliseApplication();
        dispatch( { type: TYPES.INITILISE_APP } );

        const appPreferences: AppPreferences = await fetchAppPreferencesLocally();
        dispatch( setAppPreferences( appPreferences ) );

        const userPreferences: UserPreferences = await fetchUserPreferencesLocally();
        dispatch( setUserPreferences( userPreferences ) );
        if ( !appPreferences.shouldOnboard && userPreferences.pinToMenuBar ) {
            dispatch( pinToTray( true ) );
        }
    };
};
