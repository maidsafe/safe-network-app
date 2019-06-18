import { TYPES } from '$Actions/app_manager_actions';

import { AppManagerState } from '../definitions/application.d';
import { ERRORS } from '$Constants/index';

export const initialState: AppManagerState = {
    applicationList: {}
};

export function appManager( state = initialState, action ): AppManagerState {
    const { payload } = action;

    let applicationList;
    let app;
    if ( payload && payload.appId ) {
        applicationList = { ...state.applicationList };
        app = { ...applicationList[payload.appId] };
    }

    switch ( action.type ) {
        case `${TYPES.FETCH_APPS}_SUCCESS`: {
            const newApplicationList = {};
            payload.applicationList.forEach( ( application ) => {
                if ( !application.id ) throw ERRORS.APP_ID_NOT_FOUND;
                newApplicationList[application.id] = { ...application };
            } );
            return {
                ...state,
                applicationList: newApplicationList
            };
        }

        case `${TYPES.INSTALL_APP}_PENDING`: {
            if ( !app ) return state;
            app.isInstalling = true;
            app.progress = payload.progress || 0;
            break;
        }

        case `${TYPES.INSTALL_APP}_SUCCESS`: {
            if ( !app || !app.isInstalling ) return state;
            app.isInstalling = false;
            app.progress = 100;
            break;
        }

        case `${TYPES.INSTALL_APP}_FAILURE`: {
            if ( !app || !app.isInstalling ) return state;
            app.isInstalling = false;
            app.progress = 0;
            app.error = payload.error;
            break;
        }

        case TYPES.CANCEL_APP_INSTALLATION: {
            if ( !app || !app.isInstalling ) return state;
            app.isInstalling = false;
            app.progress = 0;
            break;
        }

        case TYPES.PAUSE_APP_INSTALLATION: {
            if ( !app || !app.isInstalling ) return state;

            app.isInstalling = false;
            break;
        }

        case TYPES.RETRY_APP_INSTALLATION: {
            if ( !app || app.isInstalling ) return state;
            app.isInstalling = true;
            break;
        }

        case `${TYPES.UNINSTALL_APP}_PENDING`: {
            if ( !app ) return state;
            app.isUninstalling = true;
            break;
        }

        case `${TYPES.UNINSTALL_APP}_SUCCESS`: {
            if ( !app ) return state;
            app.isUninstalling = false;
            break;
        }

        case `${TYPES.CHECK_APP_HAS_UPDATE}`: {
            if ( !app ) return state;

            app.hasUpdate = payload.hasUpdate;
            break;
        }

        case `${TYPES.UPDATE_APP}_PENDING`: {
            if ( !app ) return state;

            app.isUpdating = true;
            app.progress = payload.progress || 0;
            break;
        }

        case `${TYPES.UPDATE_APP}_SUCCESS`: {
            if ( !app ) return state;

            app.isUpdating = false;
            app.hasUpdate = false;
            app.progress = 100;
            break;
        }

        case `${TYPES.UPDATE_APP}_FAILURE`: {
            if ( !app ) return state;

            app.isUpdating = false;
            app.progress = 0;
            app.error = payload.error;
            break;
        }

        case TYPES.SKIP_APP_UPDATE: {
            if ( !app ) return state;

            if ( !payload.version ) throw ERRORS.VERSION_NOT_FOUND;

            app.hasUpdate = false;
            app.lastSkippedVersion = payload.version;
            break;
        }

        case TYPES.RESET_APP_STATE: {
            if ( !app ) return state;

            app.isInstalling = false;
            app.isUninstalling = false;
            app.isUpdating = false;
            app.progress = null;
            app.error = null;
            break;
        }

        default:
            return state;
    }
    applicationList[app.id] = { ...app };
    return {
        ...state,
        applicationList
    };
}
