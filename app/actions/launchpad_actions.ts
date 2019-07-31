import { createActions } from 'redux-actions';
import {
    UserPreferences,
    AppPreferences,
    Preferences
} from '$Definitions/application.d';
import {
    initiliseApplication,
    fetchPreferencesLocally,
    storePreferencesLocally
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
    onboardCompleted,
    dismissNotification,
    setUserPreferences,
    setAppPreferences
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.ONBOARD_COMPLETED,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES,
    TYPES.SET_APP_PREFERENCES
);

export const getUserPreferences = () => {
    return async ( dispatch ) => {
        const { userPreferences } = await fetchPreferencesLocally();
        dispatch( setUserPreferences( userPreferences ) );
    };
};

export const initialiseApp = () => {
    return async ( dispatch ) => {
        await initiliseApplication();
        dispatch( { type: TYPES.INITILISE_APP } );

        const {
            userPreferences,
            appPreferences
        } = await fetchPreferencesLocally();
        dispatch( setAppPreferences( appPreferences ) );

        dispatch( setUserPreferences( userPreferences ) );
        if ( !appPreferences.shouldOnboard && userPreferences.pinToMenuBar ) {
            dispatch( pinToTray( true ) );
        }
    };
};
