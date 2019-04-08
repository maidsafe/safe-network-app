import path from 'path';
import { Tray, BrowserWindow, ipcMain, screen } from 'electron';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';

import {
    isRunningUnpacked,
    CONFIG,
    platform,
    WINDOWS,
    LINUX
} from '$Constants';

let tray;
let safeLaunchPadWindow;

const getWindowPosition = (): { x: number; y: number } => {
    const safeLaunchPadWindowBounds = safeLaunchPadWindow.getBounds();
    const trayBounds = tray.getBounds();

    const mainScreen = screen.getPrimaryDisplay();
    const screenBounds = mainScreen.bounds;

    // Center safeLaunchPadWindow horizontally below the tray icon
    let x = Math.round(
        trayBounds.x +
            trayBounds.width / 2 -
            safeLaunchPadWindowBounds.width / 2
    );

    if ( platform === LINUX ) {
        x = Math.round( safeLaunchPadWindowBounds.width );
    }

    // Position safeLaunchPadWindow 4 pixels vertically below the tray icon
    let y = Math.round( trayBounds.y + trayBounds.height + 4 );

    if ( platform === WINDOWS ) {
        // TODO:
        // make this minus window height
        y = Math.round( screenBounds.y - safeLaunchPadWindowBounds.height + 20 );
    }

    return { x, y };
};

const showWindow = (): void => {
    const position = getWindowPosition();

    // TODO: broken on windows/ ubuntu
    safeLaunchPadWindow.setPosition( position.x, position.y, false );
    safeLaunchPadWindow.show();
    safeLaunchPadWindow.focus();
};

const toggleWindow = (): void => {
    if ( safeLaunchPadWindow.isVisible() ) {
        safeLaunchPadWindow.hide();
    } else {
        showWindow();
    }
};

export const createTray = (): void => {
    const iconPathtray = path.resolve( __dirname, 'tray-icon.png' );

    tray = new Tray( iconPathtray );
    tray.on( 'right-click', toggleWindow );
    tray.on( 'double-click', toggleWindow );
    tray.on( 'click', ( event ) => {
        toggleWindow();

        // Show devtools when command clicked
        if (
            safeLaunchPadWindow.isVisible() &&
            process.defaultApp &&
            event.metaKey
        ) {
            safeLaunchPadWindow.openDevTools( { mode: 'undocked' } );
            // mainWindow.openDevTools({ mode:'undocked' });
        }
    } );
};

export const createSafeLaunchPadWindow = (): Application.Window => {
    safeLaunchPadWindow = new BrowserWindow( {
        width: 300,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } );
    safeLaunchPadWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    // Hide the safeLaunchPadWindow when it loses focus
    safeLaunchPadWindow.on( 'blur', () => {
        if ( !safeLaunchPadWindow.webContents.isDevToolsOpened() ) {
            safeLaunchPadWindow.hide();
        }
    } );

    safeLaunchPadWindow.webContents.on( 'did-finish-load', () => {
        // safeLaunchPadWindow.webContents.executeJavaScript(
        //   "window.peruseNav('safeLaunchPadWindow')",
        //   () => {
        //     logger.verbose('Safe Info Window Loaded');
        //   }
        // );

        // for debug
        showWindow();

        logger.info( 'LAUNCH PAD: Loaded' );

        if ( isRunningUnpacked ) {
            safeLaunchPadWindow.openDevTools( { mode: 'undocked' } );
        }
    } );

    return safeLaunchPadWindow;
};

ipcMain.on( 'show-safeLaunchPadWindow', () => {
    showWindow();
} );
