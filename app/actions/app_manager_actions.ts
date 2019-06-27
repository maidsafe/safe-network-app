import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { mockPromise } from './launchpad_actions';
import { LAUNCHPAD_APP_ID } from '$Constants/index';

export const TYPES = {
    FETCH_APPS: 'FETCH_APPS',
    INSTALL_APP: 'INSTALL_APP',
    CANCEL_APP_INSTALLATION: 'CANCEL_APP_INSTALLATION',
    PAUSE_APP_INSTALLATION: 'PAUSE_APP_INSTALLATION',
    RETRY_APP_INSTALLATION: 'RETRY_APP_INSTALLATION',
    CHECK_APP_HAS_UPDATE: 'CHECK_APP_HAS_UPDATE',
    UNINSTALL_APP: 'UNINSTALL_APP',
    UPDATE_APP: 'UPDATE_APP',
    SKIP_APP_UPDATE: 'SKIP_APP_UPDATE',
    RESET_APP_STATE: 'RESET_APP'
};

const fetchAppsFromGithub = () => mockPromise();
const installApplicationById = ( appId: string ) => mockPromise();
const uninstallApplicationById = ( appId: string ) => mockPromise();
const updateApplicationById = ( appId: string ) => mockPromise();
const checkForApplicationUpdateById = ( appId: string ) => mockPromise();
const storeApplicationSkipVersion = ( appId: string ) => mockPromise();

export const {
    cancelAppInstallation,
    pauseAppInstallation,
    retryAppInstallation,
    resetAppState
} = createActions(
    TYPES.CANCEL_APP_INSTALLATION,
    TYPES.PAUSE_APP_INSTALLATION,
    TYPES.RETRY_APP_INSTALLATION,
    TYPES.RESET_APP_STATE
);

export const fetchApps = createAliasedAction( TYPES.FETCH_APPS, () => ( {
    type: TYPES.FETCH_APPS,
    payload: fetchAppsFromGithub()
} ) );

export const installApp = createAliasedAction(
    TYPES.INSTALL_APP,
    ( appId: string ) => ( {
        type: TYPES.INSTALL_APP,
        payload: installApplicationById( appId )
    } )
);

export const uninstallApp = createAliasedAction(
    TYPES.UNINSTALL_APP,
    ( appId: string ) => ( {
        type: TYPES.UNINSTALL_APP,
        payload: uninstallApplicationById( appId )
    } )
);

export const checkAppHasUpdate = createAliasedAction(
    TYPES.CHECK_APP_HAS_UPDATE,
    ( appId: string ) => ( {
        type: TYPES.CHECK_APP_HAS_UPDATE,
        payload: checkForApplicationUpdateById( appId )
    } )
);

export const updateApp = createAliasedAction(
    TYPES.UPDATE_APP,
    ( appId: string ) => ( {
        type: TYPES.UPDATE_APP,
        payload: updateApplicationById( appId )
    } )
);

export const skipAppUpdate = createAliasedAction(
    TYPES.SKIP_APP_UPDATE,
    ( appId: string ) => ( {
        type: TYPES.SKIP_APP_UPDATE,
        payload: storeApplicationSkipVersion( appId )
    } )
);

export const updateLaunchpadApp = () => {
    return updateApp( LAUNCHPAD_APP_ID );
};

export const skipLaunchpadAppUpdate = () => {
    return skipAppUpdate( LAUNCHPAD_APP_ID );
};
