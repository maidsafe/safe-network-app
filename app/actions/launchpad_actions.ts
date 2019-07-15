import { createActions } from 'redux-actions';

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

export const checkShouldOnboard = () => ( {
    type: TYPES.CHECK_SHOULD_ONBOARD,
    payload: checkOnBoardingCompleted()
} );

export const setOnboardCompleted = () => ( {
    type: TYPES.ONBOARD_COMPLETED,
    payload: setOnBoardingCompleted()
} );
