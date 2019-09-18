import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { dialog, ipcMain, nativeImage } from 'electron';
import { logger } from '$Logger';
import { notificationTypes } from '$Constants/notifications';
import { pushNotification } from '$Actions/launchpad_actions';
import { App } from '$Definitions/application.d';

autoUpdater.autoDownload = false;
let store;

const application = {
    name: 'SAFE Network App'
};

const checkIfAppIsDownloading = () => {
    let appIsDownloading = false;
    const { applicationList } = store.getState().appManager;
    // @ts-ignore
    appIsDownloading = Object.keys( applicationList ).find( ( appId ) => {
        const anApp = applicationList[appId];
        return anApp.isDownloadingAndInstalling;
    } );
    return appIsDownloading;
};

autoUpdater.on( 'error', ( error ) => {
    dialog.showErrorBox(
        'Error: ',
        error == null ? 'unknown' : ( error.stack || error ).toString()
    );
} );

autoUpdater.on( 'update-available', ( info ) => {
    console.log( info );
    const { version } = info;
    // @ts-ignore
    const id = Math.random().toString( '36' );
    store.dispatch(
        pushNotification( {
            id,
            ...notificationTypes.UPDATE_AVAILABLE( application, version )
        } )
    );
} );

ipcMain.on( 'update-safe-network-app', ( event ) => {
    autoUpdater.downloadUpdate();
} );

autoUpdater.on( 'update-downloaded', () => {
    const appIsDownloading = checkIfAppIsDownloading();
    store.dispatch(
        pushNotification(
            notificationTypes.RESTART_APP( application, appIsDownloading )
        )
    );
} );

ipcMain.on( 'install-safe-network-app', ( event ) => {
    const appIsDownloading = checkIfAppIsDownloading();
    if ( appIsDownloading )
        store.subscribe( () => {
            const appDownloading = checkIfAppIsDownloading();
            if ( !appDownloading ) autoUpdater.quitAndInstall();
        } );
    else autoUpdater.quitAndInstall();
} );

export class AppUpdater {
    public constructor( passedStore ) {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        store = passedStore;

        try {
            autoUpdater.checkForUpdatesAndNotify();
        } catch ( error ) {
            logger.error( 'Problems with auto updating...' );
            logger.error( error );
        }
    }
}
