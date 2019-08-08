import { createAliasedAction } from 'electron-redux';
import request from 'request-promise-native';

import { LAUNCHPAD_APP_ID, APPLICATION_LIST_SOURCE } from '$Constants/index';
import { setApps } from '$Actions/app_manager_actions';
import {
    getCurrentStore,
    setNextReleaseDescription
} from '$Actions/application_actions';
import { mockPromise } from '$Actions/helpers/launchpad';
import appData from '$App/managedApplications.json';
import { logger } from '$Logger';
import { pushNotification } from '$Actions/launchpad_actions';
import { ManagedApplication } from '$Definitions/application.d';

import {
    installApplicationById,
    uninstallApplicationById,
    checkForApplicationUpdateById,
    updateApplicationById,
    storeApplicationSkipVersion
} from '../helpers/app_manager';

const userAgentRequest = request.defaults( {
    headers: {
        'User-Agent': 'safe-network-app'
    }
} );

export const TYPES = {
    ALIAS_FETCH_APPS: 'ALIAS_FETCH_APPS',
    ALIAS_FETCH_UPDATE_INFO: 'ALIAS_FETCH_UPDATE_INFO',
    ALIAS_INSTALL_APP: 'ALIAS_INSTALL_APP',
    ALIAS_CHECK_APP_HAS_UPDATE: 'ALIAS_CHECK_APP_HAS_UPDATE',
    ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP',
    ALIAS_UPDATE_APP: 'ALIAS_UPDATE_APP',
    ALIAS_SKIP_APP_UPDATE: 'ALIAS_SKIP_APP_UPDATE'
};

const fetchAppListFromServer = async (): Promise<void> => {
    logger.debug( 'Attempting to fetch application list' );
    const store = getCurrentStore();
    try {
        const response = await request( APPLICATION_LIST_SOURCE );
        const apps = JSON.parse( response );
        logger.debug( 'Application list retrieved sucessfully' );
        store.dispatch( setApps( apps.applications ) );
    } catch ( error ) {
        logger.error( error.message );
        const id: string = Math.random().toString( 36 );

        const errorNotification = {
            id,
            title: 'Remote application list could not be retrieved.',
            notificationType: 'Native'
        };
        store.dispatch( pushNotification( { notification: errorNotification } ) );
    }
};

const fetchLatestUpdateDescription = async ( app ): Promise<void> => {
    logger.debug( 'Attempting to fetch application update info for, ', app );
    const store = getCurrentStore();
    try {
        const response = await userAgentRequest(
            `https://api.github.com/repos/${app.repositoryOwner}/${app.repositorySlug}/releases/latest`
        );
        const release = JSON.parse( response );

        const updateDescription = release.body;
        logger.debug( 'Application update description retrieved sucessfully' );
        store.dispatch(
            setNextReleaseDescription( {
                appId: app.id,
                updateDescription
            } )
        );
    } catch ( error ) {
        logger.error( error.message );

        store.dispatch(
            setNextReleaseDescription( {
                appId: app.id,
                updateDescription: 'No update description available.'
            } )
        );
    }
};

export const fetchTheApplicationList = createAliasedAction(
    TYPES.ALIAS_FETCH_APPS,
    () => ( {
        type: TYPES.ALIAS_FETCH_APPS,
        payload: fetchAppListFromServer()
    } )
);
export const fetchUpdateInfo = createAliasedAction(
    TYPES.ALIAS_FETCH_UPDATE_INFO,
    ( app: ManagedApplication ) => ( {
        type: TYPES.ALIAS_FETCH_UPDATE_INFO,
        payload: fetchLatestUpdateDescription( app )
    } )
);

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
