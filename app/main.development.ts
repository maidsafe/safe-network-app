import { ipcMain, app, dialog } from 'electron';
import path from 'path';
import log from 'electron-log';
import { Store } from 'redux';
import { enforceMacOSAppLocation } from 'electron-util';

import { updateAppInfoIfNewer } from '$Actions/app_manager_actions';
import { addApplication } from '$Actions/application_actions';
import { pushNotification } from '$Actions/launchpad_actions';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { MenuBuilder } from './menu';
import { Application, App } from './definitions/application.d';
import { createSafeLaunchPadTrayWindow, createTray } from './setupLaunchPad';
import { setupBackground } from './setupBackground';
import { installExtensions, preferencesJsonSetup } from '$Utils/main_utils';
import { safeAppUpdater } from '$App/manageInstallations/safeAppUpdater';
import { notificationTypes } from '$Constants/notifications';

import {
    setupAuthDaemon,
    stopAuthDaemon
} from '$App/backgroundProcess/authDaemon';

import {
    ignoreAppLocation,
    isRunningDebug,
    isRunningDevelopment,
    isRunningTestCafeProcess,
    isRunningUnpacked,
    isRunningOnLinux,
    isRunningOnWindows,
    getAppFolderPath,
    platform,
    settingsHandlerName
} from '$Constants';

import { addNotification } from '$App/env-handling';
import { AppUpdater } from './autoUpdate';

import { setupIPCListeners } from '$Utils/ipcMainListeners';

logger.info( 'User data exists: ', app.getPath( 'userData' ) );

if ( process.env.NODE_ENV === 'production' ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

let store: Store;
let theWindow: Application.Window;
let appExiting = false;

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    logger.warn(
        'Another instance of the launcher is already running. Closing this one.'
    );
    app.quit();
} else {
    app.on( 'second-instance', ( event, commandLine, workingDirectory ) => {
        // safeAppUpdater.handleAppUpdateCallback( commandLine );
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

        setupAuthDaemon();

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

        safeAppUpdater.store = store;

        setupIPCListeners( store );
        await preferencesJsonSetup( store );

        setupBackground( store );
        theWindow = createSafeLaunchPadTrayWindow( store );

        theWindow.on( 'close', ( event ) => {
            if ( !appExiting && process.platform === 'darwin' ) {
                event.preventDefault();
                if (
                    // isRunningDevelopment ||
                    isRunningDebug ||
                    process.env.DEBUG_PROD === 'true'
                )
                    app.hide();
                else theWindow.hide();
            }
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

/**
 * Add event listeners...
 */
app.on( 'before-quit', () => {
    appExiting = true;
} );

app.on( 'quit', async ( event ) => {
    appExiting = true;
    await stopAuthDaemon();
} );

app.on( 'activate', () => {
    theWindow.show();
    theWindow.focus();
} );

app.on( 'window-all-closed', () => {
    // Respect the MAC_OS convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'open-url', ( _, url ) => {
    try {
        theWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );
