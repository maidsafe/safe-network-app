import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as ALIAS_TYPES } from '$App/actions/alias/app_manager_actions';
import { TYPES as APP_TYPES } from '$App/actions/application_actions';
import { logger } from '$Logger';

import { AppManagerState, App } from '../definitions/application.d';
import { ERRORS } from '$Constants/errors';

export const initialState: AppManagerState = {
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'SAFE Browser',
            size: '2MB',
            author: 'Maidsafe Ltd.',
            packageName: 'safe-browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe_browser',
            latestVersion: '0.1.0',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            updateDescription: '',
            type: 'userApplications'
        }
    }
};

const setApplicationList = ( state, applicationList ) => {
    const newApplicationList = {};

    Object.values( applicationList ).forEach( ( app: App ) => {
        if ( !app.id ) throw new Error( ERRORS.APP_ID_NOT_FOUND );
        newApplicationList[app.id] = { ...app };
    } );
    return {
        ...state,
        applicationList: newApplicationList
    };
};

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
        case `${TYPES.SET_APPS}`: {
            return setApplicationList( state, payload );
        }

        case TYPES.RESET_APP_STATE: {
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

        case APP_TYPES.RETRY_APP_DOWNLOAD_AND_INSTALLATION: {
            if ( !targetApp || targetApp.isDownloadingAndInstalling )
                return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.isPaused = false;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_PENDING: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.progress = payload.progress || 0;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.UPDATE_DOWNLOAD_PROGRESS: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndInstalling = true;
            targetApp.progress = payload.progress || 0;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_SUCCESS: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;

            // TODO: this data needs to be saved to local.
            targetApp.isDownloadingAndInstalling = false;
            targetApp.isInstalled = true;
            targetApp.progress = 100;
            targetApp.isPaused = false;

            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.DOWNLOAD_AND_INSTALL_APP_FAILURE: {
            if ( !targetApp || !targetApp.isDownloadingAndInstalling )
                return state;
            targetApp.isDownloadingAndInstalling = false;
            targetApp.installFailed = true;
            targetApp.progress = 0;
            targetApp.isPaused = false;

            targetApp.error = payload.error;

            return updateAppInApplicationList( state, targetApp );
        }

        // UNISTALL APP
        case `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_PENDING`: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_SUCCESS`: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = false;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_CHECK_APP_HAS_UPDATE}`: {
            if ( !targetApp ) return state;
            targetApp.hasUpdate = payload.hasUpdate;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_PENDING`: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndUpdating = true;
            targetApp.progress = payload.progress || 0;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_SUCCESS`: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndUpdating = false;
            targetApp.hasUpdate = false;
            targetApp.progress = 100;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_FAILURE`: {
            if ( !targetApp ) return state;
            targetApp.isDownloadingAndUpdating = false;
            targetApp.progress = 0;
            targetApp.error = payload.error;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_SKIP_APP_UPDATE}_PENDING`: {
            if ( !targetApp ) return state;
            if ( !payload.version ) throw new Error( ERRORS.VERSION_NOT_FOUND );
            targetApp.hasUpdate = false;
            targetApp.lastSkippedVersion = payload.version;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.SET_NEXT_RELEASE_DESCRIPTION: {
            if ( !targetApp ) return state;

            targetApp.updateDescription = payload.updateDescription;

            return updateAppInApplicationList( state, targetApp );
        }

        default:
            return state;
    }
}
