import { createActions } from 'redux-actions';

import { UserPreferences } from '$Definitions/application.d';
import { fetchUserPreferencesLocally } from './helpers/launchpad';

export const TYPES = {
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
    SET_STANDARD_WINDOW_VISIBILITY: 'SET_STANDARD_WINDOW_VISIBILITY',
};

export const {
    pushNotification,
    dismissNotification,
    setUserPreferences,
    setStandardWindowVisibility
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES,
    TYPES.SET_STANDARD_WINDOW_VISIBILITY
);

export const getUserPreferences = () => {
    return ( dispatch ) => {
        return fetchUserPreferencesLocally().then(
            ( userPreferences: UserPreferences ) =>
                dispatch( setUserPreferences( userPreferences ) )
        );
    };
};
