import { createActions, createAction } from 'redux-actions';

import { UserPreferences, AppPreferences } from '$Definitions/application.d';
import {
    initiliseApplication,
    fetchUserPreferencesLocally,
    storeAppPreferencesLocally,
    checkOnBoardingCompleted
} from './helpers/launchpad';

export const TYPES = {
    INITILISE_APP: 'INITILISE_APP',
    CHECK_SHOULD_ONBOARD: 'CHECK_SHOULD_ONBOARD',
    ONBOARD_COMPLETED: 'ONBOARD_COMPLETED',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES'
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

export const setOnboardCompleted = () => {
    return ( dispatch ) => {
        const appPreferences: AppPreferences = {
            shouldOnboard: false
        };
        return storeAppPreferencesLocally( appPreferences ).then(
            dispatch( {
                type: TYPES.ONBOARD_COMPLETED
            } )
        );
    };
};

export const checkShouldOnboard = createAction(
    TYPES.CHECK_SHOULD_ONBOARD,
    checkOnBoardingCompleted
);

export const initialiseApp = createAction(
    TYPES.INITILISE_APP,
    initiliseApplication
);
