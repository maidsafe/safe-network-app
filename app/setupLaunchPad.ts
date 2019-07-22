import path from 'path';
import { Tray, BrowserWindow, ipcMain, screen, App, Menu } from 'electron';
import { Store } from 'redux';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';

import {
    isRunningUnpacked,
    CONFIG,
    platform,
    WINDOWS,
    LINUX,
    OSX
} from '$Constants';

let tray;
let safeLaunchPadStandardWindow: Application.Window;
let safeLaunchPadTrayWindow: Application.Window;
let currentlyVisibleWindow: Application.Window;
let programmaticallyTriggeredHideEvent = false;

const getWindowPosition = (
    window: Application.Window
): { x: number; y: number } => {
    const safeLaunchPadWindowBounds = window.getBounds();
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
        x = Math.round( screenBounds.width - safeLaunchPadWindowBounds.width );
    }

    // Position safeLaunchPadWindow 4 pixels vertically below the tray icon
    let y = Math.round( trayBounds.y + trayBounds.height + 4 );

    if ( platform === WINDOWS ) {
        y = Math.round(
            screenBounds.height - safeLaunchPadWindowBounds.height - 40
        );
    }

    return { x, y };
};

const showWindow = ( window: Application.Window ): void => {
    if ( window.webContents.id === safeLaunchPadStandardWindow.webContents.id ) {
        window.center();
    } else {
        const position = getWindowPosition( window );
        window.setPosition( position.x, position.y, false );
    }
    window.show();
    window.focus();
};

const changeWindowVisibility = (
    window: Application.Window,
    store: Store
): void => {
    if ( window.isVisible() ) {
        programmaticallyTriggeredHideEvent = true;
        window.hide();
    } else {
        showWindow( window );
    }
};

export const createTray = ( store: Store, app: App ): void => {
    const iconPathtray = path.resolve( __dirname, 'tray-icon.png' );

    tray = new Tray( iconPathtray );
    tray.on( 'right-click', () => {
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );
    tray.on( 'double-click', () => {
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );
    tray.on( 'click', ( event ) => {
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );
    tray.setToolTip( app.getName() );
};

export const createSafeLaunchPadStandardWindow = (
    store: Store,
    app: App
): Application.Window => {
    safeLaunchPadStandardWindow = new BrowserWindow( {
        width: 320,
        height: 600,
        show: true,
        frame: true,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } ) as Application.Window;
    currentlyVisibleWindow = safeLaunchPadStandardWindow;

    safeLaunchPadStandardWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    safeLaunchPadStandardWindow.on( 'close', ( event ) => {
        event.preventDefault();
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    safeLaunchPadStandardWindow.on( 'show', () => {
        // macOS-specific: show dock icon when standard window is showing
        if ( app.dock ) {
            app.dock.show();
        }
    } );

    safeLaunchPadStandardWindow.on( 'hide', () => {
        if ( platform !== LINUX && !programmaticallyTriggeredHideEvent ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
        if ( programmaticallyTriggeredHideEvent ) {
            programmaticallyTriggeredHideEvent = false;
        }
    } );

    safeLaunchPadStandardWindow.webContents.on( 'did-finish-load', () => {
        logger.info( 'LAUNCH PAD Standard Window: Loaded' );
    } );

    ipcMain.on( 'pinToTray', ( _event, enable ) => {
        changeWindowVisibility( currentlyVisibleWindow, store );
        if ( !enable ) {
            currentlyVisibleWindow = safeLaunchPadStandardWindow;
        } else {
            currentlyVisibleWindow = safeLaunchPadTrayWindow;
        }
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    return safeLaunchPadStandardWindow;
};

export const createSafeLaunchPadTrayWindow = (
    store: Store,
    app: App
): Application.Window => {
    safeLaunchPadTrayWindow = new BrowserWindow( {
        width: 320,
        height: 600,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } ) as Application.Window;
    safeLaunchPadTrayWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    safeLaunchPadTrayWindow.on( 'show', () => {
        // macOS-specific: hide dock icon when tray is showing
        if ( app.dock ) {
            app.dock.hide();
        }
    } );

    safeLaunchPadTrayWindow.on( 'hide', () => {
        if ( platform !== LINUX && !programmaticallyTriggeredHideEvent ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
        if ( programmaticallyTriggeredHideEvent ) {
            programmaticallyTriggeredHideEvent = false;
        }
    } );

    // Hide the safeLaunchPadTrayWindow when it loses focus
    safeLaunchPadTrayWindow.on( 'blur', () => {
        if ( platform === LINUX ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
    } );

    safeLaunchPadTrayWindow.webContents.on( 'did-finish-load', () => {
        logger.info( 'LAUNCH PAD Tray Window: Loaded' );
    } );

    return safeLaunchPadTrayWindow;
};
