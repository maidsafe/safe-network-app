import { TYPES } from '$App/actions/launchpad_actions';
import { TYPES as NOTIFICATION_TYPES } from '$Actions/alias/notification_actions';
import { TYPES as ALIAS__TYPES } from '$Actions/alias/launchpad_actions';
import {
    LaunchpadState,
    UserPreferences,
    AppPreferences
} from '../definitions/application.d';

import { ERRORS } from '$Constants/errors';
import { defaultPreferences } from '$Constants/index';
import { logger } from '$Logger';

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

            // allow payload to set it for testing...
            const randomNotificationId: string =
                payload.id || Math.random().toString( 36 );

            if ( !payload.notificationType )
                throw new Error( ERRORS.NOTIFICATION_TYPE_NOT_FOUND );

            const notification = { ...payload, id: randomNotificationId };

            newNotifications[randomNotificationId] = notification;
            const updatedState = { ...state, notifications: newNotifications };
            return updatedState;
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const newNotifications = { ...state.notifications };
            if ( !payload.id ) throw new Error( ERRORS.NOTIFICATION_ID_NOT_FOUND );

            delete newNotifications[payload.id];
            return { ...state, notifications: newNotifications };
        }

        case ALIAS__TYPES.ALIAS__SHOULD_ONBOARD: {
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
        case ALIAS__TYPES.ALIAS__AUTO_LAUNCH:
        case ALIAS__TYPES.ALIAS__PIN_TO_TRAY:
        case ALIAS__TYPES.ALIAS__STORE_PREFERENCES:
        case NOTIFICATION_TYPES.ACCEPT_NOTIFICATION:
        case NOTIFICATION_TYPES.DENY_NOTIFICATION:
        default:
            return state;
    }
}
