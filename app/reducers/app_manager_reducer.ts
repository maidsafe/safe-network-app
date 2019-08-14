import compareVersions from 'compare-versions';
import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as ALIAS_TYPES } from '$App/actions/alias/app_manager_actions';
import { TYPES as APP_TYPES } from '$App/actions/application_actions';
import { logger } from '$Logger';
import { AppManagerState, App } from '../definitions/application.d';
import { ERRORS } from '$Constants/errors';

export const initialState: AppManagerState = {
    // TODO: We need a hard list of apps. Incase of no internet....
    applicationList: {
        'safe.browser': {
            id: 'safe.browser',
            name: 'SAFE Browser',
            size: '2MB',
            author: 'Maidsafe Ltd.',
            packageName: 'safe-browser',
            repositoryOwner: 'maidsafe',
            repositorySlug: 'safe_browser',
            isInstalled: false,
            latestVersion: '0.1.0',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            updateDescription: '',
            type: 'userApplications'
        }
    }
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

            const currentVersion = theCurrentApp.latestVersion;
            const newVersion = payload.latestVersion;

            if ( compareVersions( newVersion, currentVersion ) < 1 ) {
                // do nothing
                return state;
            }

            // otherwise we overwrite.
            targetApp = { ...payload, isInstalled: theCurrentApp.isInstalled };

            return updateAppInApplicationList( state, targetApp );
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
            targetApp.progress = 0;
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
            if ( !payload.latestVersion )
                throw new Error( ERRORS.VERSION_NOT_FOUND );
            targetApp.hasUpdate = false;
            targetApp.lastSkippedVersion = payload.latestVersion;
            return updateAppInApplicationList( state, targetApp );
        }

        default:
            return state;
    }
}
