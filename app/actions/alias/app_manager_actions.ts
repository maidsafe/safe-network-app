import path from 'path';
import os from 'os';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import { ipcRenderer, remote, app } from 'electron';
import { createAliasedAction } from 'electron-redux';
import request from 'request-promise-native';
import { I18n } from 'react-redux-i18n';
import { getAppDataPath } from '$Utils/app_utils';

import {
    LAUNCHPAD_APP_ID,
    DEFAULT_APP_ICON_PATH,
    isRunningTestCafeProcess,
    isRunningOnMac,
    isRunningOnLinux
} from '$Constants/index';
import { updateAppInfoIfNewer } from '$Actions/app_manager_actions';
import { getInstalledLocation } from '$App/manageInstallations/helpers';
import { getS3Folder } from '$App/utils/gets3Folders';

import { NOTIFICATION_TYPES } from '$Constants/notifications';

import {
    getCurrentStore,
    downloadAndInstallAppPending
} from '$Actions/application_actions';
import { mockPromise } from '$Actions/helpers/launchpad';
import { logger } from '$Logger';
import { pushNotification } from '$Actions/launchpad_actions';
import { App } from '$Definitions/application.d';

//  need to add a check to see if its a launchpad update or a random update question is do we use this or what to use
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
    ALIAS_RESUME_DOWNLOAD_OF_ALL_APPS: 'ALIAS_RESUME_DOWNLOAD_OF_ALL_APPS',
    ALIAS_PAUSE_DOWNLOAD_OF_ALL_APPS: 'ALIAS_PAUSE_DOWNLOAD_OF_ALL_APPS',
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
    ALIAS_RESTART_APP: 'ALIAS_RESTART_APP',
    ALIAS_SKIP_APP_UPDATE: 'ALIAS_SKIP_APP_UPDATE'
};

export const fetchDefaultAppIconFromLocal = ( applicationId: string ): string => {
    return path.resolve( DEFAULT_APP_ICON_PATH, `${applicationId}.png` );
};

const fetchAppIconFromServer = ( application ): Promise<string> => {
    return new Promise( async ( resolve ) => {
        try {
            const filename = `${
                application.id
            }-${application.latestVersion.replace( /\./g, '-' )}.png`;
            const filePath = path.resolve(
                getAppDataPath(),
                'thumbnail',
                filename
            );

            // TODO: need to remove old icon

            if ( !fse.pathExistsSync( filePath ) ) {
                const appIcon = await request( {
                    uri: `https://github.com/${application.repositoryOwner}/${application.repositorySlug}/releases/download/${application.latestVersion}/icon.png`,
                    encoding: null,
                    resolveWithFullResponse: true
                } );

                fse.outputFileSync( filePath, appIcon.body );
            }
            return resolve( filePath );
        } catch ( error ) {
            logger.warn( error.message );
            return resolve( null );
        }
    } );
};

const getLatestAppVersions = async (): Promise<void> => {
    logger.debug( 'Attempting to fetch application versions from The Internets' );

    if ( isRunningTestCafeProcess ) return;

    const store = getCurrentStore();
    const apps = store.getState().appManager.applicationList;

    Object.keys( apps ).forEach( async ( theAppId ) => {
        const application: App = apps[theAppId];

        try {
            const s3Url = getS3Folder( application );

            // https://safe-network-app.s3.eu-west-2.amazonaws.com/safe-network-app-win/latest.yml
            let latestVersionFile = `${s3Url}/latest.yml`;

            if ( isRunningOnMac ) latestVersionFile = `${s3Url}/latest-mac.yml`;

            if ( isRunningOnLinux )
                latestVersionFile = `${s3Url}/latest-linux.yml`;

            const response = await request( latestVersionFile );
            const latestVersion = `v${yaml.safeLoad( response ).version}`;

            logger.debug(
                `${application.name} latest version is ${latestVersion}`
            );

            const updatedApp = { ...application, latestVersion };
            updatedApp.iconPath =
                ( await fetchAppIconFromServer( updatedApp ) ) ||
                fetchDefaultAppIconFromLocal( updatedApp.id );

            store.dispatch( updateAppInfoIfNewer( updatedApp ) );
        } catch ( error ) {
            logger.error( error.message );
        }
    } );
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

const resumeDownloadOfAllApps = ( appList: App ) => {
    // eslint-disable-next-line array-callback-return
    Object.keys( appList ).map( ( appId ) => {
        const application = appList[appId];
        if ( application.isDownloadingAndInstalling && application.isPaused )
            ipcRenderer.send( 'resumeDownload', application );
    } );
};

const pauseDownloadOfAllApps = ( appList: App ) => {
    // eslint-disable-next-line array-callback-return
    Object.keys( appList ).map( ( appId ) => {
        const application = appList[appId];
        if ( application.isDownloadingAndInstalling && !application.isPaused )
            ipcRenderer.send( 'pauseDownload', application );
    } );
};

const updateTheApplication = ( application: App ) => {
    if ( application.name === 'SAFE Network App' )
        ipcRenderer.send( 'update-safe-network-app', application );
    else console.log( 'no app update feature available at the moment' );
};

const restartTheApplication = ( application: App ) => {
    if ( application.name === 'SAFE Network App' )
        ipcRenderer.send( 'install-safe-network-app' );
    else console.log( 'no app update feature available at the moment' );
};

export const fetchLatestAppVersions = createAliasedAction(
    TYPES.ALIAS_FETCH_APPS,
    () => {
        return {
            type: TYPES.ALIAS_FETCH_APPS,
            payload: getLatestAppVersions()
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

export const pauseAllDownloads = createAliasedAction(
    TYPES.ALIAS_PAUSE_DOWNLOAD_OF_ALL_APPS,
    ( appList: App ) => ( {
        type: TYPES.ALIAS_PAUSE_DOWNLOAD_OF_APP,
        payload: pauseDownloadOfAllApps( appList )
    } )
);

export const resumeDownload = createAliasedAction(
    TYPES.ALIAS_RESUME_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_RESUME_DOWNLOAD_OF_APP,
        payload: resumeDownloadOfApp( application )
    } )
);

export const resumeAllDownloads = createAliasedAction(
    TYPES.ALIAS_RESUME_DOWNLOAD_OF_ALL_APPS,
    ( appList: App ) => ( {
        type: TYPES.ALIAS_RESUME_DOWNLOAD_OF_APP,
        payload: resumeDownloadOfAllApps( appList )
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
        payload: updateTheApplication( application )
    } )
);

export const restartApp = createAliasedAction(
    TYPES.ALIAS_RESTART_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS_RESTART_APP,
        payload: restartTheApplication( application )
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
