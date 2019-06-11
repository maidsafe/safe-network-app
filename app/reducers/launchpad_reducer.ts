import { TYPES } from '$Actions/launcher_actions';
import { LaunchpadState, UserPreferences } from '../definitions/application.d';

export const initialState: LaunchpadState = {
    shouldOnboard: false,
    userPreferences: {
        autoUpdate: false,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: false,
        warnOnAccessingClearnet: true
    },
    notifications: {},
    launchpad: {
        hasUpdate: false,
        newVersion: null,
        isUpdating: false
    }
};

export function launchpadReducer( state = initialState, action ): LaunchpadState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SHOULD_ONBOARD: {
            if ( typeof payload.shouldOnboard !== 'boolean' ) {
                throw new Error( 'Invalid type of value passed' );
            }
            return { ...state, shouldOnboard: payload.shouldOnboard };
        }

        case TYPES.GET_USER_PREFERENCES:
        case TYPES.UPDATE_USER_PREFERENCES: {
            const userPreferences: UserPreferences = {
                ...state.userPreferences,
                ...payload.userPreferences
            };
            if (
                Object.keys( userPreferences ).length !==
                Object.keys( initialState.userPreferences ).length
            ) {
                throw new Error( 'Invalid properties found' );
            }
            return { ...state, userPreferences: { ...userPreferences } };
        }

        case TYPES.CHECK_LAUNCHPAD_HAS_UPDATE: {
            const launchpad = { ...state.launchpad };
            if ( !payload.launchpad.hasUpdate ) {
                return state;
            }
            launchpad.hasUpdate = payload.launchpad.hasUpdate;
            launchpad.newVersion = payload.launchpad.newVersion;
            return { ...state, launchpad: { ...launchpad } };
        }

        case TYPES.UPDATE_LAUNCHPAD: {
            if ( !state.launchpad.hasUpdate ) {
                return state;
            }
            const launchpad = { ...state.launchpad };
            launchpad.isUpdating = true;
            return { ...state, launchpad: { ...launchpad } };
        }

        case `${TYPES.UPDATE_LAUNCHPAD}_FAILURE`: {
            const launchpad = { ...state.launchpad };
            launchpad.isUpdating = false;
            return { ...state, launchpad: { ...launchpad } };
        }

        case `${TYPES.UPDATE_LAUNCHPAD}_SUCCESS`: {
            const launchpad = { ...initialState.launchpad };
            launchpad.hasUpdate = false;
            launchpad.isUpdating = false;
            launchpad.newVersion = null;
            return { ...state, launchpad: { ...launchpad } };
        }

        case TYPES.PUSH_NOTIFICATION: {
            const notifications = { ...state.notifications };
            if ( !payload.notification.id ) {
                throw new Error( 'Notification id required' );
            }
            notifications[payload.notification.id] = {
                ...payload.notification
            };
            return { ...state, notifications: { ...notifications } };
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const notifications = { ...state.notifications };
            if ( !payload.notificationId ) {
                throw new Error( 'Notification id required' );
            }
            delete notifications[payload.notificationId];
            return { ...state, notifications: { ...notifications } };
        }

        default:
            return state;
    }
}
