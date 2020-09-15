import path from 'path';
import os from 'os';
import { ipcRenderer, remote, app } from 'electron';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import { createAliasedAction } from 'electron-redux';
import request from 'request-promise-native';
import { I18n } from 'react-redux-i18n';

import { getAppDataPath } from '$Utils/app_utils';
import {
    RELEASE_CHANNEL,
    ALPHA,
    BETA,
    LAUNCHPAD_APP_ID,
    DEFAULT_APP_ICON_PATH,
    isRunningTestCafeProcess,
    isRunningOnMac,
    isRunningOnLinux
} from '$Constants/index';
import { BIN } from '$Constants/installConstants';
import {
    updateAppInfoIfNewer,
    resetAppUpdateState,
    appIsUpdating
} from '$Actions/app_manager_actions';
import {
    getInstalledLocation,
    checkIfAppIsInstalledLocally
} from '$App/manageInstallations/helpers';
import { getMaidsafeS3Folder } from '$App/utils/getMaidsafeS3Folder';
import { NOTIFICATION_TYPES } from '$Constants/notifications';
import {
    getCurrentStore,
    downloadAndInstallAppPending
} from '$Actions/application_actions';
import { mockPromise } from '$Actions/helpers/launchpad';
import { logger } from '$Logger';
import {
    pushNotification,
    dismissNotification
} from '$Actions/launchpad_actions';
import { App } from '$Definitions/application.d';

export const storeApplicationSkipVersion = ( application: App ) => mockPromise();

const userAgentRequest = request.defaults( {
    headers: {
        'User-Agent': 'sn_app'
    }
} );

// these actions all trigger some async functionality and require updates via normal electron-redux
// actions down the line...
export const TYPES = {
    ALIAS__RESUME_DOWNLOAD_OF_ALL_APPS: 'ALIAS__RESUME_DOWNLOAD_OF_ALL_APPS',
    ALIAS__PAUSE_DOWNLOAD_OF_ALL_APPS: 'ALIAS__PAUSE_DOWNLOAD_OF_ALL_APPS',
    ALIAS__FETCH_APPS: 'ALIAS__FETCH_APPS',

    ALIAS__FETCH_UPDATE_INFO: 'ALIAS__FETCH_UPDATE_INFO',

    ALIAS__OPEN_APP: 'ALIAS__OPEN_APP',

    ALIAS__DOWNLOAD_AND_INSTALL_APP: 'ALIAS__DOWNLOAD_AND_INSTALL_APP',
    ALIAS__UNINSTALL_APP: 'ALIAS__UNINSTALL_APP',
    ALIAS__PAUSE_DOWNLOAD_OF_APP: 'ALIAS__PAUSE_DOWNLOAD_OF_APP',
    ALIAS__RESUME_DOWNLOAD_OF_APP: 'ALIAS__RESUME_DOWNLOAD_OF_APP',
    ALIAS__CANCEL_DOWNLOAD_OF_APP: 'ALIAS__CANCEL_DOWNLOAD_OF_APP',

    ALIAS__UPDATE_APP: 'ALIAS__UPDATE_APP',
    ALIAS__RESTART_APP: 'ALIAS__RESTART_APP'
};

export const fetchDefaultAppIconFromLocal = ( applicationId: string ): string => {
    return path.resolve( DEFAULT_APP_ICON_PATH, `${applicationId}.png` );
};

const fetchAppIconFromServer = async ( application ): Promise<string | null> => {
    try {
        const filename = `${application.id}-${application.latestVersion.replace(
            /\./g,
            '-'
        )}.png`;
        const filePath = path.resolve( getAppDataPath(), 'thumbnail', filename );

        // TODO: need to remove old icon
        if ( !fse.pathExistsSync( filePath ) ) {
            const appIcon = await request( {
                uri: `https://github.com/${application.repositoryOwner}/${application.repositorySlug}/releases/download/${application.latestVersion}/icon.png`,
                encoding: null,
                resolveWithFullResponse: true
            } );

            fse.outputFileSync( filePath, appIcon.body );
        }
        return filePath;
    } catch ( error ) {
        logger.info( 'Error getting icon from github', error.message );
        return null;
    }
};

const getLatestElectronAppVersions = async (): Promise<void> => {
    logger.debug( 'Attempting to fetch application versions from The Internets' );

    if ( isRunningTestCafeProcess ) return;

    const store = getCurrentStore();
    const apps = store.getState().appManager.applicationList;

    Object.keys( apps ).forEach( async ( theAppId ) => {
        const application: App = apps[theAppId];

        const updatedApp = {
            ...application
        };
        const appIsInstalledLocally = await checkIfAppIsInstalledLocally(
            application
        );

        if ( appIsInstalledLocally ) {
            updatedApp.isInstalled = true;
            ipcRenderer.send( 'checkApplicationsForUpdate', updatedApp );
        }

        if ( application.type === BIN ) {
            logger.info(
                'cannot check for bin type app updates as yet. ',
                application.name
            );
            store.dispatch( updateAppInfoIfNewer( updatedApp ) );

            return;
        }

        try {
            const s3Url = getMaidsafeS3Folder( application );

            let channelModifier = 'latest';

            if ( RELEASE_CHANNEL === ALPHA ) channelModifier = 'alpha';

            if ( RELEASE_CHANNEL === BETA ) channelModifier = 'beta';

            // https://safe-network-app.s3.eu-west-2.amazonaws.com/sn_app-win/latest.yml
            let latestVersionFile = `${s3Url}/${channelModifier}`;

            if ( isRunningOnMac ) latestVersionFile = `${latestVersionFile}-mac`;

            if ( isRunningOnLinux )
                latestVersionFile = `${latestVersionFile}-linux`;

            const response = await request( `${latestVersionFile}.yml` );
            const latestVersion = `v${yaml.safeLoad( response ).version}`;

            logger.debug(
                `${application.name} latest version is ${latestVersion}`
            );

            updatedApp.latestVersion = latestVersion;

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

export const updateTheApplication = ( application: App ) => {
    if ( application.name === 'SAFE Network App' ) {
        ipcRenderer.send( 'update-sn_app', application );

        return;
    }

    ipcRenderer.send( 'updateApplication', application );

    const store = getCurrentStore();
    // store.dispatch(
    //     dismissNotification( {
    //         id: `${application.packageName}-update-notification`
    //     } )
    // );
    store.dispatch( appIsUpdating( application ) );
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

const restartTheApplication = ( application: App ) => {
    if ( application.name === 'SAFE Network App' )
        ipcRenderer.send( 'install-sn_app' );
    else console.log( 'no app update feature available at the moment' );
};

export const fetchLatestAppVersions = createAliasedAction(
    TYPES.ALIAS__FETCH_APPS,
    () => {
        return {
            type: TYPES.ALIAS__FETCH_APPS,
            payload: getLatestElectronAppVersions()
        };
    }
);

export const downloadAndInstallApp = createAliasedAction(
    TYPES.ALIAS__DOWNLOAD_AND_INSTALL_APP,
    ( application: App ) => ( {
        // TODO: This type should be the final action no? Is that why
        // nothing is returned from these aliases?
        type: TYPES.ALIAS__DOWNLOAD_AND_INSTALL_APP,
        payload: installThatApp( application )
    } )
);

export const pauseDownload = createAliasedAction(
    TYPES.ALIAS__PAUSE_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__PAUSE_DOWNLOAD_OF_APP,
        payload: pauseDownloadOfApp( application )
    } )
);

export const pauseAllDownloads = createAliasedAction(
    TYPES.ALIAS__PAUSE_DOWNLOAD_OF_ALL_APPS,
    ( appList: App ) => ( {
        type: TYPES.ALIAS__PAUSE_DOWNLOAD_OF_APP,
        payload: pauseDownloadOfAllApps( appList )
    } )
);

export const resumeDownload = createAliasedAction(
    TYPES.ALIAS__RESUME_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__RESUME_DOWNLOAD_OF_APP,
        payload: resumeDownloadOfApp( application )
    } )
);

export const resumeAllDownloads = createAliasedAction(
    TYPES.ALIAS__RESUME_DOWNLOAD_OF_ALL_APPS,
    ( appList: App ) => ( {
        type: TYPES.ALIAS__RESUME_DOWNLOAD_OF_APP,
        payload: resumeDownloadOfAllApps( appList )
    } )
);

export const cancelDownload = createAliasedAction(
    TYPES.ALIAS__CANCEL_DOWNLOAD_OF_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__CANCEL_DOWNLOAD_OF_APP,
        payload: cancelDownloadOfApp( application )
    } )
);

export const unInstallApp = createAliasedAction(
    TYPES.ALIAS__UNINSTALL_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__UNINSTALL_APP,
        payload: unInstallApplication( application )
    } )
);

export const updateApp = createAliasedAction(
    TYPES.ALIAS__UPDATE_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__UPDATE_APP,
        payload: updateTheApplication( application )
    } )
);

export const restartApp = createAliasedAction(
    TYPES.ALIAS__RESTART_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__RESTART_APP,
        payload: restartTheApplication( application )
    } )
);

export const openApp = createAliasedAction(
    TYPES.ALIAS__OPEN_APP,
    ( application: App ) => ( {
        type: TYPES.ALIAS__OPEN_APP,
        payload: openTheApplication( application )
    } )
);
