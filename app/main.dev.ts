/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, ipcMain } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Store } from 'redux';

import { addApplication } from '$Actions/application_actions';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { MenuBuilder } from './menu';
import { Application } from './definitions/application.d';
import {
    createSafeLaunchPadStandardWindow,
    createSafeLaunchPadTrayWindow,
    createTray,
    changeWindowVisibility,
    currentlyVisibleWindow
} from './setupLaunchPad';
import { setupBackground } from './setupBackground';

import managedApplications from '$App/managedApplications.json';

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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
) {
    require( 'electron-debug' )();
}

const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require( 'electron-devtools-installer' );
    const forceDownload = true;
    // const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map( ( name ) =>
            installer.default( installer[name], forceDownload )
        )
    ).catch( console.log );
};

// const loadMiddlewarePackages = [];

let store: Store;

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    logger.warn(
        'Another instance of the launcher is already running. Closing this one.'
    );
    app.quit();
} else {
    app.on( 'second-instance', ( event, commandLine, workingDirectory ) => {
        // Someone tried to run a second instance, we should focus our window.
        if ( currentlyVisibleWindow ) {
            if ( currentlyVisibleWindow.window.isMinimized() ) currentlyVisibleWindow.window.restore();
            currentlyVisibleWindow.window.focus();
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

        // initialSetup of apps,
        const allApplications = managedApplications.applications;
        if ( managedApplications.version === '1' ) {
            Object.keys( allApplications ).forEach( ( application ) => {
                console.log( 'Managing:', application );
                store.dispatch( addApplication( allApplications[application] ) );
            } );
        }

        ipcMain.on( 'set-standard-window-visibility', ( _event, isVisible ) => {
            changeWindowVisibility( currentlyVisibleWindow, store );
            if ( isVisible ) {
                currentlyVisibleWindow.window.destroy();
                createSafeLaunchPadStandardWindow( store, app );
            } else {
                currentlyVisibleWindow.window.destroy();
                createSafeLaunchPadTrayWindow( store, app );
            }
            changeWindowVisibility( currentlyVisibleWindow, store );
        } );

        createTray( store, app );
        createSafeLaunchPadStandardWindow( store, app );
        setupBackground( store, currentlyVisibleWindow );

        const menuBuilder = new MenuBuilder( currentlyVisibleWindow.window );
        menuBuilder.buildMenu();

        // Remove this if your app does not use auto updates
        // eslint-disable-next-line no-new
        new AppUpdater();
    } );
}

/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'open-url', ( _, url ) => {
    try {
        currentlyVisibleWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );
