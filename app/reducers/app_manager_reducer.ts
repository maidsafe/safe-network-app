import compareVersions from 'compare-versions';
import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as ALIAS__TYPES } from '$Actions/alias/app_manager_actions';
import { TYPES as APP_TYPES } from '$Actions/application_actions';
import { logger } from '$Logger';
import { AppManagerState, App } from '../definitions/application.d';
import { ERRORS } from '$Constants/errors';

import { initialAppManager } from '$Reducers/initialAppManager';

export const initialState = initialAppManager;

const updateAppInApplicationList = ( state, targetApp ) => {
    const updatedState = {
        ...state,
        applicationList: { ...state.applicationList }
    };

    updatedState.applicationList[targetApp.id] = targetApp;
    return updatedState;
};

export function appManager( state = initialState, action ): AppManagerState {
    const { payload } = action;

    let targetApp;

    // either we pass a FULL application object, with ID.
    if ( payload && payload.id ) {
        targetApp = { ...state.applicationList[payload.id] };
    }

    switch ( action.type ) {
        case `${TYPES.UPDATE_APP_INFO_IF_NEWER}`: {
            if ( !payload.latestVersion )
                throw new Error( ERRORS.VERSION_NOT_FOUND );

            if ( !payload.id ) throw new Error( ERRORS.APP_ID_NOT_FOUND );

            if ( !state.applicationList[payload.id] ) {
                // if a new app, we just add it.
                targetApp = { ...payload };
                return updateAppInApplicationList( state, targetApp );
            }

            const theCurrentApp = state.applicationList[payload.id];

            const currentVersion =
                theCurrentApp.currentVersion || theCurrentApp.latestVersion;
            const newVersion = payload.latestVersion;
            theCurrentApp.currentVersion = currentVersion;

            // info is not newer
            if ( compareVersions( newVersion, currentVersion ) < 1 ) {
                // only update local info
                targetApp = {
                    ...theCurrentApp,
                    isInstalled: payload.isInstalled,
                    isOpen: payload.isOpen
                };

                // do nothing
                return updateAppInApplicationList( state, targetApp );
            }

            // otherwise we overwrite.
            targetApp = {
                ...theCurrentApp,
                ...payload,
                hasUpdate: !!theCurrentApp.isInstalled,
                currentVersion: theCurrentApp.isInstalled
                    ? currentVersion
                    : null
            };

            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.RESET_TO_INITIAL_STATE: {
            return initialState;
        }

        case TYPES.RESET_APP_INSTALLATION_STATE: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndInstalling = false;
            targetApp.isUninstalling = false;
            targetApp.isDownloadingAndUpdating = false;
            targetApp.progress = null;
            targetApp.error = null;
            return updateAppInApplicationList( state, targetApp );
        }

        // INSTALL
        case APP_TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;
            targetApp.isDownloadingAndInstalling = false;
            targetApp.progress = 0;
            targetApp.isPaused = false;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.isPaused = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.RESUME_APP_DOWNLOAD_AND_INSTALLATION: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.isPaused = false;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.progress = payload.progress || 0;
            targetApp.error = null;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.UPDATE_DOWNLOAD_PROGRESS: {
            if ( !targetApp ) return state;
            targetApp.progress = payload.progress || 0;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_SUCCESS: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;

            // TODO: this data needs to be saved to local.
            targetApp.isDownloadingAndInstalling = false;
            targetApp.isInstalled = true;
            targetApp.progress = 0;
            targetApp.isPaused = false;
            targetApp.currentVersion = payload.latestVersion;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_FAILURE: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndInstalling = false;
            targetApp.installFailed = true; // why do we need this?
            targetApp.isPaused = false;
            targetApp.error = payload.error;

            return updateAppInApplicationList( state, targetApp );
        }

        // UNISTALL APP
        case APP_TYPES.UNINSTALL_APP_PENDING: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.UNINSTALL_APP_SUCCESS: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = false;
            targetApp.progress = 0;
            targetApp.isInstalled = false;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.UNINSTALL_APP_FAILURE: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = false;
            targetApp.error = payload.error;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.SET_CURRENT_VERSION: {
            if ( !targetApp ) return state;

            const { currentVersion } = payload;
            const { latestVersion } = targetApp;
            if ( !currentVersion ) throw new Error( ERRORS.VERSION_NOT_FOUND );

            targetApp.isInstalled = true;
            targetApp.currentVersion = currentVersion;

            if ( compareVersions( latestVersion, currentVersion ) < 1 ) {
                targetApp.latestVersion = currentVersion;
            }

            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.APP_HAS_UPDATE: {
            if ( !targetApp ) return state;
            targetApp.hasUpdate = payload.hasUpdate;

            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.APP_IS_UPDATING: {
            if ( !targetApp ) return state;
            targetApp.isUpdating = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.RESET_APP_UPDATE_STATE: {
            if ( !targetApp || !targetApp.hasUpdate ) return state;

            targetApp.hasUpdate = false;
            targetApp.isUpdating = false;

            return updateAppInApplicationList( state, targetApp );
        }

        default:
            return state;
    }
}
