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
            applicationList = {};
            payload.applicationList.forEach( ( application ) => {
                if ( !application.id ) throw ERRORS.APP_ID_NOT_FOUND;

                applicationList[application.id] = application;
            } );
            return {
                ...state,
                applicationList: { ...applicationList }
            };
        }

        case `${TYPES.INSTALL_APP}_PENDING`: {
            if ( !app ) return state;
            app.isInstalling = true;
            app.progress = payload.progress || 0;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.INSTALL_APP}_SUCCESS`: {
            if ( !app ) return state;

            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 100;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.INSTALL_APP}_FAILURE`: {
            if ( !app ) return state;

            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 0;
            app.error = payload.error;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case TYPES.CANCEL_APP_INSTALLATION: {
            if ( !app ) return state;

            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            app.progress = 0;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case TYPES.PAUSE_APP_INSTALLATION: {
            if ( !app ) return state;

            if ( !app.isInstalling ) {
                return state;
            }
            app.isInstalling = false;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case TYPES.RETRY_APP_INSTALLATION: {
            if ( !app ) return state;

            if ( app.isInstalling ) {
                return state;
            }
            app.isInstalling = true;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UNINSTALL_APP}_PENDING`: {
            if ( !app ) return state;

            app.isUninstalling = true;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UNINSTALL_APP}_SUCCESS`: {
            if ( !app ) return state;

            app.isUninstalling = false;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.CHECK_APP_HAS_UPDATE}`: {
            if ( !app ) return state;

            app.hasUpdate = payload.hasUpdate;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UPDATE_APP}_PENDING`: {
            if ( !app ) return state;

            app.isUpdating = true;
            app.progress = payload.progress || 0;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UPDATE_APP}_SUCCESS`: {
            if ( !app ) return state;

            app.isUpdating = false;
            app.hasUpdate = false;
            app.progress = 100;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UPDATE_APP}_FAILURE`: {
            if ( !app ) return state;

            app.isUpdating = false;
            app.progress = 0;
            app.error = payload.error;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case TYPES.SKIP_APP_UPDATE: {
            if ( !app ) return state;

            if ( !payload.version ) throw ERRORS.VERSION_NOT_FOUND;

            app.hasUpdate = false;
            app.lastSkippedVersion = payload.version;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case TYPES.RESET_APP_STATE: {
            if ( !app ) return state;

            app.isInstalling = false;
            app.isUninstalling = false;
            app.isUpdating = false;
            app.progress = null;
            app.error = null;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        default:
            return state;
    }
}
