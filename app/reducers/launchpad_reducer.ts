import { TYPES } from '$Actions/launcher_actions';
import { LaunchpadState } from '../definitions/application.d';

const initialState: LaunchpadState = {
    shouldOnboard: false,
    userPreferences: {},
    notifications: {},
    launchpad: {
        hasUpdate: false,
        newVersion: null,
        isUpdating: false
    }
};

export function launchpadReducer( state = initialState, action ) {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SHOULD_ONBOARD: {
            return { ...state, shouldOnboard: payload.shouldOnboard };
        }

        case TYPES.GET_USER_PREFERENCES:
        case TYPES.UPDATE_USER_PREFERENCES: {
            const userPreferences = { ...payload.userPreferences };
            return { ...state, userPreferences };
        }

        case TYPES.CHECK_LAUNCHPAD_HAS_UPDATE: {
            const launchpad = { ...state.launchpad };
            if ( payload.hasUpdate ) {
                launchpad.hasUpdate = payload.hasUpdate;
                launchpad.newVersion = payload.newVersion;
            }
            return { ...state, launchpad };
        }

        case TYPES.UPDATE_LAUNCHPAD: {
            if ( !state.launchpad.hasUpdate ) {
                return state;
            }
            const launchpad = { ...state.launchpad };
            launchpad.isUpdating = true;
            return { ...state, launchpad };
        }

        case `${TYPES.UPDATE_LAUNCHPAD}_FAILURE`: {
            const launchpad = { ...state.launchpad };
            launchpad.isUpdating = false;
            return { ...state, launchpad };
        }

        case `${TYPES.UPDATE_LAUNCHPAD}_SUCCESS`: {
            const launchpad = { ...initialState.launchpad };
            return { ...state, launchpad };
        }

        case TYPES.PUSH_NOTIFICATION: {
            const notifications = { ...state.notifications };
            const notificationId = ''; // TODO generate random ID
            notifications[notificationId] = payload.notification;
            return { ...state, notifications };
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const notifications = { ...state.notifications };
            delete notifications[payload.notificationId];
            return { ...state, notifications };
        }

        default:
            return state;
    }
}
