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
import { app } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { MenuBuilder } from './menu';

// eslint-disable-next-line import/no-unresolved
import { Application } from './definitions/application.d';

// import { PROTOCOLS } from '$Constants';
import { createSafeLaunchPadWindow, createTray } from './setupLaunchPad';
import { setupBackground } from './setupBackground';

app.setPath( 'userData', path.resolve( app.getPath( 'temp' ), 'sauther' ) );

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

let store;
let mainWindow: Application.Window;

// app.setAsDefaultProtocolClient( PROTOCOLS.SAFE_LAUNCHER );
//
// const isDefault = app.isDefaultProtocolClient( PROTOCOLS.SAFE_LAUNCHER);

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    console.error( 'Not got the lock. This is so sad' );
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

        createTray();
        mainWindow = createSafeLaunchPadWindow();
        setupBackground();
        // const bgWindow = setupBackground();
        //

        // mainWindow = new BrowserWindow({
        //   show: false,
        //   width: 1024,
        //   height: 728
        // });
        //
        // mainWindow.loadURL(`file://${__dirname}/app.html`);
        //
        // // @TODO: Use 'ready-to-show' event
        // //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
        // mainWindow.webContents.on('did-finish-load', () => {
        //   if (!mainWindow) {
        //     throw new Error('"mainWindow" is not defined');
        //   }
        //   if (process.env.START_MINIMIZED) {
        //     mainWindow.minimize();
        //   } else {
        //     mainWindow.show();
        //     mainWindow.focus();
        //   }
        // });
        //
        // mainWindow.on('closed', () => {
        //   mainWindow = null;
        // });

        const menuBuilder = new MenuBuilder( mainWindow );
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
        mainWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );
