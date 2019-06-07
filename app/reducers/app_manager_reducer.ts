import { TYPES } from '$Actions/app_manager_actions';

import { AppManagerState } from '../definitions/application.d';

const initialState: AppManagerState = {
    applicationList: {}
};

export function appManager( state = initialState, action ) {
    const { payload } = action;

    let applicationList;
    let app;
    if ( payload.appId ) {
        applicationList = { ...state.applicationList };
        app = applicationList[payload.appId];
    }

    switch ( action.type ) {
        case `${TYPES.FETCH_APPS}_SUCCESS`: {
            return {
                ...state,
                applicationList: { ...payload.applicationList }
            };
        }

        case `${TYPES.INSTALL_APP}_PENDING`: {
            app.isInstalling = true;
            app.progress = payload.progress || 0;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.INSTALL_APP}_SUCCESS`: {
            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 100;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.INSTALL_APP}_FAILURE`: {
            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 0;
            app.error = payload.error;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case TYPES.CANCEL_APP_INSTALLATION: {
            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 0;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case TYPES.PAUSE_APP_INSTALLATION: {
            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case TYPES.RETRY_APP_INSTALLATION: {
            if ( app.isInstalling ) {
                return state;
            }
            app.isInstalling = true;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UNINSTALL_APP}_PENDING`: {
            app.isUninstalling = true;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UNINSTALL_APP}_SUCCESS`: {
            app.isUninstalling = false;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UPDATE_APP}_PENDING`: {
            app.isUpdating = true;
            app.progress = payload.progress || 0;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UPDATE_APP}_SUCCESS`: {
            app.isUpdating = false;
            app.progress = 100;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UPDATE_APP}_FAILURE`: {
            app.isUpdating = false;
            app.progress = 0;
            app.error = payload.error;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case TYPES.SKIP_APP_UPDATE: {
            app.lastSkippedVersion = payload.version;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case TYPES.RESET_APP_STATE: {
            app.isInstalling = false;
            app.isUninstalling = false;
            app.isUpdating = false;
            app.progress = null;
            app.error = null;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        default:
            return state;
    }
}
