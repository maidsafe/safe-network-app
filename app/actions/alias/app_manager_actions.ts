import { createAliasedAction } from 'electron-redux';
import { LAUNCHPAD_APP_ID } from '$Constants/index';

import {
    fetchAppsFromGithub,
    installApplicationById,
    uninstallApplicationById,
    checkForApplicationUpdateById,
    updateApplicationById,
    storeApplicationSkipVersion
} from '../helpers/app_manager';

export const TYPES = {
    ALIAS_FETCH_APPS: 'ALIAS_FETCH_APPS',
    ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP',
    ALIAS_CHECK_APP_HAS_UPDATE: 'ALIAS_CHECK_APP_HAS_UPDATE',
    ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP',
    ALIAS_UPDATE_APP: 'ALIAS_UPDATE_APP',
    ALIAS_SKIP_APP_UPDATE: 'ALIAS_SKIP_APP_UPDATE'
};

export const fetchApps = createAliasedAction( TYPES.ALIAS_FETCH_APPS, () => ( {
    type: TYPES.ALIAS_FETCH_APPS,
    payload: fetchAppsFromGithub()
} ) );

export const installApp = createAliasedAction(
    TYPES.ALIAS_INSTALL_APP,
    ( appId: string ) => ( {
        type: TYPES.ALIAS_INSTALL_APP,
        payload: installApplicationById( appId )
    } )
);

export const uninstallApp = createAliasedAction(
    TYPES.ALIAS_UNINSTALL_APP,
    ( appId: string ) => ( {
        type: TYPES.ALIAS_UNINSTALL_APP,
        payload: uninstallApplicationById( appId )
    } )
);

export const checkAppHasUpdate = createAliasedAction(
    TYPES.ALIAS_CHECK_APP_HAS_UPDATE,
    ( appId: string ) => ( {
        type: TYPES.ALIAS_CHECK_APP_HAS_UPDATE,
        payload: checkForApplicationUpdateById( appId )
    } )
);

export const updateApp = createAliasedAction(
    TYPES.ALIAS_UPDATE_APP,
    ( appId: string ) => ( {
        type: TYPES.ALIAS_UPDATE_APP,
        payload: updateApplicationById( appId )
    } )
);

export const skipAppUpdate = createAliasedAction(
    TYPES.ALIAS_SKIP_APP_UPDATE,
    ( appId: string ) => ( {
        type: TYPES.ALIAS_SKIP_APP_UPDATE,
        payload: storeApplicationSkipVersion( appId )
    } )
);

export const updateLaunchpadApp = () => {
    return updateApp( LAUNCHPAD_APP_ID );
};

export const skipLaunchpadAppUpdate = () => {
    return skipAppUpdate( LAUNCHPAD_APP_ID );
};
