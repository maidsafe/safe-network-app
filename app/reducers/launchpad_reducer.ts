import { TYPES } from '$Actions/launcher_actions';
import { LaunchpadState, UserPreferences } from '../definitions/application.d';
import { ERRORS } from '$Constants/index';

export const initialState: LaunchpadState = {
    shouldOnboard: false,
    userPreferences: {
        autoUpdate: false,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: false,
        warnOnAccessingClearnet: true
    },
    notifications: {}
};

export function launchpadReducer( state = initialState, action ): LaunchpadState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SHOULD_ONBOARD: {
            if ( typeof payload.shouldOnboard !== 'boolean' )
                throw ERRORS.INVALID_TYPE;

            return { ...state, shouldOnboard: payload.shouldOnboard };
        }

        case TYPES.SET_USER_PREFERENCES: {
            const userPreferences: UserPreferences = {
                ...state.userPreferences,
                ...payload.userPreferences
            };
            if (
                Object.keys( userPreferences ).length !==
                Object.keys( initialState.userPreferences ).length
            )
                throw ERRORS.INVALID_PROP;

            return { ...state, userPreferences: { ...userPreferences } };
        }

        case TYPES.PUSH_NOTIFICATION: {
            const notifications = { ...state.notifications };
            if ( !payload.notification.id )
                throw ERRORS.NOTIFICATION_ID_NOT_FOUND;

            notifications[payload.notification.id] = {
                ...payload.notification
            };
            return { ...state, notifications: { ...notifications } };
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const notifications = { ...state.notifications };
            if ( !payload.notificationId ) throw ERRORS.NOTIFICATION_ID_NOT_FOUND;

            delete notifications[payload.notificationId];
            return { ...state, notifications: { ...notifications } };
        }

        default:
            return state;
    }
}
