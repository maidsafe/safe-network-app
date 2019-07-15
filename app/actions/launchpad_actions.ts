import { createActions, createAction } from 'redux-actions';

import { UserPreferences } from '$Definitions/application.d';
import {
    fetchUserPreferencesLocally,
    checkOnBoardingCompleted,
    setOnBoardingCompleted
} from './helpers/launchpad';

export const TYPES = {
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

export const checkShouldOnboard = createAction(
    TYPES.CHECK_SHOULD_ONBOARD,
    checkOnBoardingCompleted
);

export const setOnboardCompleted = createAction(
    TYPES.ONBOARD_COMPLETED,
    setOnBoardingCompleted
);
