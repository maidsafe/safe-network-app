import { ipcMain, app } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Store } from 'redux';

import { setApps } from '$Actions/app_manager_actions';
import hardCodedApps from './managedApplications.json';
import { addApplication } from '$Actions/application_actions';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { MenuBuilder } from './menu';
import { Application, ManagedApplication } from './definitions/application.d';
import { createSafeLaunchPadTrayWindow, createTray } from './setupLaunchPad';
import { setupBackground } from './setupBackground';
import { installExtensions, preferencesJsonSetup } from '$Utils/main_utils';

import {
    getAppFolderPath,
    platform,
    settingsHandlerName,
    defaultPreferences
} from '$Constants';
import { addNotification } from '$App/env-handling';

require( '$Utils/ipcMainListners' );

logger.info( 'User data exists: ', app.getPath( 'userData' ) );

/* eslint-disable-next-line import/no-default-export */
export default class AppUpdater {
    public constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;

        try {
            autoUpdater.checkForUpdatesAndNotify();
        } catch ( error ) {
            logger.error( 'Problems with auto updating...' );
            logger.error( error );
        }
    }
}

if ( process.env.NODE_ENV === 'production' ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

let store: Store;
let mainWindow: Application.Window;
let trayWindow: Application.Window;

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    logger.warn(
        'Another instance of the launcher is already running. Closing this one.'
    );
    app.quit();
} else {
    app.on( 'second-instance', ( event, commandLine, workingDirectory ) => {
        // Someone tried to run a second instance, we should focus our window.
        if ( mainWindow ) {
            if ( mainWindow.isMinimized() ) mainWindow.restore();
            mainWindow.focus();
        }
    } );

    // Create myWindow, load the rest of the app, etc...

    app.on( 'ready', async () => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            await installExtensions();
        }

        const initialState = {};
        store = configureStore( initialState );

        // start with hardcoded list of apps.
        store.dispatch( setApps( hardCodedApps.applications ) );

        await preferencesJsonSetup( store );

        setupBackground( store );
        trayWindow = createSafeLaunchPadTrayWindow( store );
        createTray( store );

        const menuBuilder = new MenuBuilder( trayWindow, store );
        menuBuilder.buildMenu();

        addNotification( store );

        // Remove this if your app does not use auto updates
        // eslint-disable-next-line no-new
        new AppUpdater();
    } );
}

/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () => {
    // Respect the MAC_OS convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'open-url', ( _, url ) => {
    try {
        mainWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );
