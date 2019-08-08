import { TYPES } from '$App/actions/launchpad_actions';
import { TYPES as NOTIFICATION_TYPES } from '$Actions/alias/notification_actions';
import { TYPES as ALIAS_TYPES } from '$Actions/alias/launchpad_actions';
import {
    LaunchpadState,
    UserPreferences,
    AppPreferences
} from '../definitions/application.d';

import { ERRORS } from '$Constants/errors';
import { defaultPreferences } from '$Constants/index';

export const initialState: LaunchpadState = {
    ...defaultPreferences,
    notifications: {},
    notificationCheckBox: false,
    isTrayWindow: false
};

export function launchpadReducer( state = initialState, action ): LaunchpadState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_USER_PREFERENCES: {
            const newUserPreferences: UserPreferences = {
                ...state.userPreferences,
                ...payload
            };
            if (
                Object.keys( newUserPreferences ).length !==
                Object.keys( initialState.userPreferences ).length
            ) {
                throw new Error( ERRORS.INVALID_PROP );
            }

            return { ...state, userPreferences: newUserPreferences };
        }

        case TYPES.SET_APP_PREFERENCES: {
            const newAppPreferences: AppPreferences = {
                ...state.appPreferences,
                ...payload
            };
            if (
                Object.keys( newAppPreferences ).length !==
                Object.keys( initialState.appPreferences ).length
            ) {
                throw ERRORS.INVALID_PROP;
            }

            return { ...state, appPreferences: newAppPreferences };
        }

        case TYPES.PUSH_NOTIFICATION: {
            const newNotifications = { ...state.notifications };
            if ( !payload.notification || !payload.notification.id )
                throw new Error( ERRORS.NOTIFICATION_ID_NOT_FOUND );
            if ( !payload.notification.notificationType )
                throw new Error( ERRORS.NOTIFICATION_TYPE_NOT_FOUND );

            newNotifications[payload.notification.id] = {
                ...payload.notification
            };
            return { ...state, notifications: newNotifications };
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const newNotifications = { ...state.notifications };
            if ( !payload.notificationId )
                throw new Error( ERRORS.NOTIFICATION_ID_NOT_FOUND );

            delete newNotifications[payload.notificationId];
            return { ...state, notifications: newNotifications };
        }

        case ALIAS_TYPES.ALIAS_SHOULD_ONBOARD: {
            if ( typeof payload.shouldOnboard !== 'boolean' )
                throw new Error( ERRORS.INVALID_TYPE );

            return {
                ...state,
                appPreferences: {
                    ...state.appPreferences,
                    shouldOnboard: payload.shouldOnboard
                }
            };
        }

        case TYPES.SET_AS_TRAY_WINDOW: {
            return { ...state, isTrayWindow: payload };
        }

        case NOTIFICATION_TYPES.NOTIFICATION_TOGGLE_CHECK_BOX: {
            return { ...state, notificationCheckBox: payload };
        }

        // Alias Types Alias Pin To Tray is a duplicate of Set As Tray Window and Set As Tray Window is the right one
        case ALIAS_TYPES.ALIAS_AUTO_LAUNCH:
        case ALIAS_TYPES.ALIAS_PIN_TO_TRAY:
        case ALIAS_TYPES.ALIAS_STORE_PREFERENCES:
        case NOTIFICATION_TYPES.ACCEPT_NOTIFICATION:
        case NOTIFICATION_TYPES.DENY_NOTIFICATION:
        default:
            return state;
    }
}
