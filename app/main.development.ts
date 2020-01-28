import { app } from 'electron';
import { Store } from 'redux';
import { enforceMacOSAppLocation } from 'electron-util';

import { MenuBuilder } from './menu';
import { Application } from './definitions/application.d';
import { createSafeLaunchPadTrayWindow } from './setupLaunchPad';
import { setupBackground } from './setupBackground';
import { AppUpdater } from './autoUpdate';

import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { installExtensions, preferencesJsonSetup } from '$Utils/main_utils';
import { electronAppUpdater } from '$App/manageInstallations/electronAppUpdater';
import {
    setupAuthDaemon,
    stopAuthDaemon
} from '$App/backgroundProcess/authDaemon';
import {
    ignoreAppLocation,
    isRunningDebug,
    isRunningTestCafeProcess,
    isRunningUnpacked,
    isRunningOnLinux,
    isRunningOnWindows
} from '$Constants';
import { addNotification } from '$App/add-env-notifications';
import { setupIPCListeners } from '$Utils/ipcMainListeners';

logger.info( 'User data exists: ', app.getPath( 'userData' ) );

if ( process.env.NODE_ENV === 'production' ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

let store: Store;
let theWindow: Application.Window;

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    logger.warn(
        'Another instance of the launcher is already running. Closing this one.'
    );
    app.quit();
} else {
    app.on( 'second-instance', ( _event, _commandLine, _workingDirectory ) => {
        // electronAppUpdater.handleAppUpdateCallback( commandLine );
        // Someone tried to run a second instance, we should focus our window.
        if ( theWindow ) {
            if ( theWindow.isMinimized() ) theWindow.restore();
            theWindow.focus();
        }
    } );

    // Create myWindow, load the rest of the app, etc...

    app.on( 'ready', async () => {
        if ( !ignoreAppLocation && !isRunningTestCafeProcess ) {
            enforceMacOSAppLocation();
        }

        // setupAuthDaemon();

        if (
            // isRunningTestCafeProcess ||
            // isRunningDevelopment ||
            isRunningDebug ||
            process.env.DEBUG_PROD === 'true'
        ) {
            await installExtensions();
        }

        const initialState = {};
        store = configureStore( initialState );

        electronAppUpdater.store = store;

        setupIPCListeners( store );
        await preferencesJsonSetup( store );

        setupBackground( store );
        theWindow = createSafeLaunchPadTrayWindow( store );

        theWindow.on( 'close', ( _event ) => {
            if ( isRunningOnWindows || isRunningOnLinux ) app.quit();
        } );

        const menuBuilder = new MenuBuilder( theWindow, store );
        menuBuilder.buildMenu();

        addNotification( store );

        if (
            !isRunningTestCafeProcess &&
            !isRunningUnpacked &&
            app.whenReady()
        ) {
            // eslint-disable-next-line no-new
            new AppUpdater( store );
        }
    } );
}

app.on( 'quit', async ( _event ) => {
    await stopAuthDaemon();
} );

app.on( 'activate', () => {
    if ( !theWindow.isDestroyed ) {
        theWindow.show();
        theWindow.focus();
    } else {
        theWindow = createSafeLaunchPadTrayWindow( store );
    }
} );

app.on( 'window-all-closed', () => {
    // Respect the MAC_OS convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'open-url', ( _, _url ) => {
    try {
        theWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );
