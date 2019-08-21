import path from 'path';
import os from 'os';
import fse from 'fs-extra';
import { ipcRenderer } from 'electron';
import { createAliasedAction } from 'electron-redux';
import request from 'request-promise-native';
import { I18n } from 'react-redux-i18n';

import {
    LAUNCHPAD_APP_ID,
    APPLICATION_LIST_SOURCE,
    isRunningTestCafeProcess
} from '$Constants/index';
import { updateAppInfoIfNewer } from '$Actions/app_manager_actions';
import { getInstalledLocation } from '$App/manageInstallations/helpers';
import { NOTIFICATION_TYPES } from '$Constants/notifications';

import {
    getCurrentStore,
    downloadAndInstallAppPending
} from '$Actions/application_actions';
import { mockPromise } from '$Actions/helpers/launchpad';
import { logger } from '$Logger';
import { pushNotification } from '$Actions/launchpad_actions';
import { App } from '$Definitions/application.d';

export const updateApplication = ( application: App ) => mockPromise();
export const checkForApplicationUpdate = ( application: App ) => mockPromise();
export const storeApplicationSkipVersion = ( application: App ) => mockPromise();

const userAgentRequest = request.defaults( {
    headers: {
        'User-Agent': 'safe-network-app'
    }
} );

// these actions all trigger some async functionality and require updates via normal electron-redux
// actions down the line...
export const TYPES = {
    ALIAS_FETCH_APPS: 'ALIAS_FETCH_APPS',

    ALIAS_FETCH_UPDATE_INFO: 'ALIAS_FETCH_UPDATE_INFO',
    ALIAS_CHECK_APP_HAS_UPDATE: 'ALIAS_CHECK_APP_HAS_UPDATE',

    ALIAS_OPEN_APP: 'ALIAS_OPEN_APP',

    ALIAS_DOWNLOAD_AND_INSTALL_APP: 'ALIAS_DOWNLOAD_AND_INSTALL_APP',
    ALIAS_UNINSTALL_APP: 'ALIAS_UNINSTALL_APP',
    ALIAS_PAUSE_DOWNLOAD_OF_APP: 'ALIAS_PAUSE_DOWNLOAD_OF_APP',
    ALIAS_RESUME_DOWNLOAD_OF_APP: 'ALIAS_RESUME_DOWNLOAD_OF_APP',
    ALIAS_CANCEL_DOWNLOAD_OF_APP: 'ALIAS_CANCEL_DOWNLOAD_OF_APP',

    ALIAS_UPDATE_APP: 'ALIAS_UPDATE_APP',
    ALIAS_SKIP_APP_UPDATE: 'ALIAS_SKIP_APP_UPDATE'
};

const getAppIcon = ( application ): Promise<string> => {
    return new Promise( async ( resolve ) => {
        try {
            const filename = `${application.id}.png`;
            const filePath = path.resolve( os.tmpdir(), filename );

            const appIcon = await request( {
                uri: `https://github.com/${application.repositoryOwner}/${application.repositorySlug}
                    /releases/download/v${application.latestVersion}/icon.png`,
                encoding: null,
                resolveWithFullResponse: true
            } );

            fse.outputFileSync( filePath, appIcon.body );
            return resolve( fse.pathExists( filePath ) && filePath );
        } catch ( error ) {
            logger.warn( error.message );
            return resolve( null );
        }
    } );
};

const fetchAppListFromServer = async (): Promise<void> => {
    logger.debug( 'Attempting to fetch application list' );

    if ( isRunningTestCafeProcess ) return;

    const store = getCurrentStore();
    try {
        const response = await request( APPLICATION_LIST_SOURCE );
        const apps = JSON.parse( response );
        logger.debug( 'Application list retrieved successfully' );

        Object.keys( apps.applications ).forEach( async ( theAppId ) => {
            const theApp = apps.applications[theAppId];
            theApp.iconUrl = await getAppIcon( theApp );
            store.dispatch( updateAppInfoIfNewer( theApp ) );
        } );
    } catch ( error ) {
        logger.error( error.message );
        const id: string = Math.random().toString( 36 );

        const errorNotification = {
            id,
            title: I18n.t( 'notifications.title.unable_to_get_app_list' ),
            notificationType: NOTIFICATION_TYPES.STANDARD,
            type: 'NO_APP_LIST'
        };
        store.dispatch( pushNotification( errorNotification ) );
    }
};

export const unInstallApplication = ( application: App ) => {
    ipcRenderer.send( 'unInstallApplication', application );
};

const installThatApp = ( application ) => {
    const store = getCurrentStore();
    store.dispatch( downloadAndInstallAppPending( application ) );
    ipcRenderer.send( 'initiateDownload', application );
};
const openTheApplication = ( application ) => {
    ipcRenderer.send( 'openApplication', application );
};

const pauseDownloadOfApp = ( application ) => {
    ipcRenderer.send( 'pauseDownload', application );
};

const cancelDownloadOfApp = ( application ) => {
    ipcRenderer.send( 'cancelDownload', application );
};

const resumeDownloadOfApp = ( application ) => {
    ipcRenderer.send( 'resumeDownload', application );
};

export const fetchTheApplicationList = createAliasedAction(
    TYPES.ALIAS_FETCH_APPS,
    () => {
        return {
            type: TYPES.ALIAS_FETCH_APPS,
            payload: fetchAppListFromServer()
        };
    }
);

export const downloadAndInstallApp = createAliasedAction(
    TYPES.ALIAS_DOWNLOAD_AND_INSTALL_APP,
    ( application: App ) => ( {
        // TODO: This type should be the final action no? Is that why
        // nothing is returned from these aliases?
        type: TYPES.ALIAS_DOWNLOAD_AND_INSTALL_APP,
        payload: installThatApp( application )
    } )
);

export const pauseDownload = createAliasedAction(
    TYPES.ALIAS_PAUSE_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_PAUSE_DOWNLOAD_OF_APP,
        payload: pauseDownloadOfApp( application )
    } )
);

export const resumeDownload = createAliasedAction(
    TYPES.ALIAS_RESUME_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_RESUME_DOWNLOAD_OF_APP,
        payload: resumeDownloadOfApp( application )
    } )
);

export const cancelDownload = createAliasedAction(
    TYPES.ALIAS_CANCEL_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_CANCEL_DOWNLOAD_OF_APP,
        payload: cancelDownloadOfApp( application )
    } )
);

export const unInstallApp = createAliasedAction(
    TYPES.ALIAS_UNINSTALL_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_UNINSTALL_APP,
        payload: unInstallApplication( application )
    } )
);

export const checkAppHasUpdate = createAliasedAction(
    TYPES.ALIAS_CHECK_APP_HAS_UPDATE,
    ( application: App ) => ( {
        type: TYPES.ALIAS_CHECK_APP_HAS_UPDATE,
        payload: checkForApplicationUpdate( application )
    } )
);

export const updateApp = createAliasedAction(
    TYPES.ALIAS_UPDATE_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_UPDATE_APP,
        payload: updateApplication( application )
    } )
);

export const skipAppUpdate = createAliasedAction(
    TYPES.ALIAS_SKIP_APP_UPDATE,
    ( application: App ) => ( {
        type: TYPES.ALIAS_SKIP_APP_UPDATE,
        payload: storeApplicationSkipVersion( application )
    } )
);

export const openApp = createAliasedAction(
    TYPES.ALIAS_OPEN_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_OPEN_APP,
        payload: openTheApplication( application )
    } )
);

export const updateLaunchpadApp = () => {
    return updateApp( LAUNCHPAD_APP_ID );
};

export const skipLaunchpadAppUpdate = () => {
    return skipAppUpdate( LAUNCHPAD_APP_ID );
};
