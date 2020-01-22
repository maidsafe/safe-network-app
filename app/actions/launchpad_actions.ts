import { createActions } from 'redux-actions';

import { triggerSetAsTrayWindow } from './alias/launchpad_actions';

import {
    UserPreferences,
    AppPreferences,
    Preferences
} from '$Definitions/application.d';
import { settingsHandler } from '$Actions/helpers/settings_handler';


export const TYPES = {
    ONBOARD_COMPLETED: 'ONBOARD_COMPLETED',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
    SET_APP_PREFERENCES: 'SET_APP_PREFERENCES',
    SET_AS_TRAY_WINDOW: 'SET_AS_TRAY_WINDOW'
};

export const {
    pushNotification,
    onboardCompleted,
    dismissNotification,
    setUserPreferences,
    setAppPreferences,
    setAsTrayWindow
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.ONBOARD_COMPLETED,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES,
    TYPES.SET_APP_PREFERENCES,
    TYPES.SET_AS_TRAY_WINDOW
);

export const getUserPreferences = () => {
    return async ( dispatch ) => {
        const { userPreferences } = await settingsHandler.getPreferences();
        dispatch( setUserPreferences( userPreferences ) );
    };
};
