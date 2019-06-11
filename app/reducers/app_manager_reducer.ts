import { TYPES } from '$Actions/app_manager_actions';

import { AppManagerState } from '../definitions/application.d';

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
                if ( !application.id ) {
                    throw new Error( 'Application ID not found' );
                }
                applicationList[application.id] = application;
            } );
            return {
                ...state,
                applicationList: { ...applicationList }
            };
        }

        case `${TYPES.INSTALL_APP}_PENDING`: {
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
            app.isUninstalling = false;
            return {
                ...state,
                applicationList: {
                    ...applicationList,
                    [payload.appId]: { ...app }
                }
            };
        }

        case `${TYPES.UPDATE_APP}_PENDING`: {
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
            app.isUpdating = false;
            app.progress = 100;
            applicationList[payload.appId] = { ...app };
            return { ...state, applicationList };
        }

        case `${TYPES.UPDATE_APP}_FAILURE`: {
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
            if ( !payload.version ) {
                throw new Error( 'Skip version not found' );
            }
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
            if ( !app ) {
                throw new Error( 'Application not found' );
            }
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
