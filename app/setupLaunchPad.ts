import path from 'path';
import { Tray, BrowserWindow, ipcMain, screen, App, Menu } from 'electron';
import { Store } from 'redux';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';
import { setStandardWindowVisibility } from '$Actions/launchpad_actions';

import {
    isRunningUnpacked,
    CONFIG,
    platform,
    WINDOWS,
    LINUX
} from '$Constants';

let tray;
let safeLaunchPadStandardWindow: Application.Window;
let safeLaunchPadTrayWindow: Application.Window;
let currentlyVisibleWindow: Application.Window;

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
        // TODO:
        // make this minus window height
        y = Math.round( screenBounds.y - safeLaunchPadWindowBounds.height + 20 );
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
        if (
            window.webContents.id === safeLaunchPadStandardWindow.webContents.id
        ) {
            store.dispatch( setStandardWindowVisibility( false ) );
        }
        window.hide();
    } else {
        if (
            window.webContents.id === safeLaunchPadStandardWindow.webContents.id
        ) {
            store.dispatch( setStandardWindowVisibility( true ) );
        }
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

        // Show devtools when command clicked
        if (
            safeLaunchPadStandardWindow.isVisible() &&
            process.defaultApp &&
            event.metaKey
        ) {
            safeLaunchPadStandardWindow.openDevTools( { mode: 'undocked' } );
        }
    } );
    const contextMenu = Menu.buildFromTemplate( [
        {
            label: app.getName(),
            type: 'normal',
            click: () => {
                changeWindowVisibility( currentlyVisibleWindow, store );
            }
        },
        {
            label: 'Exit',
            type: 'normal',
            click: () => {
                app.exit();
            }
        }
    ] );
    tray.setToolTip( app.getName() );
    tray.setContextMenu( contextMenu );
};

export const createSafeLaunchPadStandardWindow = (
    store: Store
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
    safeLaunchPadStandardWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    safeLaunchPadStandardWindow.on( 'close', ( event ) => {
        event.preventDefault();
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    safeLaunchPadStandardWindow.webContents.on( 'did-finish-load', () => {
        currentlyVisibleWindow = safeLaunchPadStandardWindow;

        logger.info( 'LAUNCH PAD Standard Window: Loaded' );

        if ( isRunningUnpacked ) {
            safeLaunchPadStandardWindow.openDevTools( { mode: 'undocked' } );
        }
    } );

    ipcMain.on( 'set-standard-window-visibility', ( _event, isVisible ) => {
        changeWindowVisibility( currentlyVisibleWindow, store );
        if ( isVisible ) {
            currentlyVisibleWindow = safeLaunchPadStandardWindow;
        } else {
            currentlyVisibleWindow = safeLaunchPadTrayWindow;
        }
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    return safeLaunchPadStandardWindow;
};

export const createSafeLaunchPadTrayWindow = (
    store: Store
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

    // Hide the safeLaunchPadTrayWindow when it loses focus
    safeLaunchPadTrayWindow.on( 'blur', () => {
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    safeLaunchPadTrayWindow.webContents.on( 'did-finish-load', () => {
        logger.info( 'LAUNCH PAD Tray Window: Loaded' );

        if ( isRunningUnpacked ) {
            safeLaunchPadTrayWindow.openDevTools( { mode: 'undocked' } );
        }
    } );

    return safeLaunchPadTrayWindow;
};
