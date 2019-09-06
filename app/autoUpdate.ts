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

autoUpdater.on( 'error', ( error ) => {
    dialog.showErrorBox(
        'Error: ',
        error == null ? 'unknown' : ( error.stack || error ).toString()
    );
} );

autoUpdater.on( 'update-available', ( info ) => {
    console.log( info );
    const { version } = info;
    store.dispatch(
        pushNotification(
            notificationTypes.UPDATE_AVAILABLE( application, version )
        )
    );
} );

ipcMain.on( 'update-safe-network-app', ( event ) => {
    autoUpdater.downloadUpdate();
} );

autoUpdater.on( 'update-downloaded', () => {
    let appIsDownloading = false;
    const { applicationList } = store.getState().appManager;
    // @ts-ignore
    appIsDownloading = Object.keys( applicationList ).find( ( appId ) => {
        const anApp = applicationList[appId];
        return anApp.isDownloadingAndInstalling;
    } );
    store.dispatch(
        pushNotification(
            notificationTypes.RESTART_APP( application, appIsDownloading )
        )
    );
} );

ipcMain.on( 'install-safe-network-app', ( event ) => {
    store.subscribe( () => {
        let appIsDownloading = false;
        const { applicationList } = store.getState().appManager;
        // @ts-ignore
        appIsDownloading = Object.keys( applicationList ).find( ( appId ) => {
            const app = applicationList[appId];
            return app.isDownloadingAndInstalling;
        } );
        if ( !appIsDownloading ) {
            autoUpdater.quitAndInstall();
        }
    } );
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
