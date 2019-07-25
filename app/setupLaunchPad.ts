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
    LINUX,
    OSX
} from '$Constants';

interface WindowMeta {
    window: Application.Window;
    type: 'tray' | 'standard';
}

let tray;
let safeLaunchPadStandardWindow: Application.Window;
let safeLaunchPadTrayWindow: Application.Window;
export let currentlyVisibleWindow: WindowMeta;
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

const showWindow = ( windowMeta: WindowMeta ): void => {
    if ( windowMeta.type === 'standard' ) {
        windowMeta.window.center();
    } else {
        const position = getWindowPosition( windowMeta.window );
        windowMeta.window.setPosition( position.x, position.y, false );
    }
    windowMeta.window.show();
    windowMeta.window.focus();
};

export const changeWindowVisibility = (
    windowMeta: WindowMeta, 
    store: Store
): void => {
    if ( windowMeta.window.isVisible() ) {
        if ( windowMeta.type === 'standard' ) {
            store.dispatch( setStandardWindowVisibility( false ) );
        }
        programmaticallyTriggeredHideEvent = true;
        windowMeta.window.hide();
    } else {
        console.log('I should see this log when standard window shows');
        if ( windowMeta.type === 'standard' ) {
            store.dispatch( setStandardWindowVisibility( true ) );
        }
        showWindow( windowMeta );
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
            currentlyVisibleWindow.type === 'standard' && currentlyVisibleWindow.isVisible() &&
            process.defaultApp &&
            event.metaKey
        ) {
            currentlyVisibleWindow.window.openDevTools( { mode: 'undocked' } );
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
    store: Store,
    app: App
): void => {
    const safeLaunchPadStandardWindow = new BrowserWindow( {
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
    currentlyVisibleWindow = { window: safeLaunchPadStandardWindow, type: 'standard' };

    currentlyVisibleWindow.window.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    currentlyVisibleWindow.window.on( 'close', ( event ) => {
        event.preventDefault();
        changeWindowVisibility( currentlyVisibleWindow, store );
    } );

    currentlyVisibleWindow.window.on( 'show', () => {
        // macOS-specific: show dock icon when standard window is showing
        if ( app.dock ) {
            app.dock.show();
        }
    } );

    currentlyVisibleWindow.window.on( 'hide', () => {
        if ( platform !== LINUX && !programmaticallyTriggeredHideEvent ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
        if ( programmaticallyTriggeredHideEvent ) {
            programmaticallyTriggeredHideEvent = false;
        }
    } );

    currentlyVisibleWindow.window.webContents.on( 'did-finish-load', () => {
        logger.info( 'LAUNCH PAD Standard Window: Loaded' );

        if ( isRunningUnpacked ) {
            currentlyVisibleWindow.window.openDevTools( { mode: 'undocked' } );
        }
    } );
};

export const createSafeLaunchPadTrayWindow = (
    store: Store,
    app: App
): void => {
    const safeLaunchPadTrayWindow = new BrowserWindow( {
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
    currentlyVisibleWindow = { window: safeLaunchPadTrayWindow, type: 'tray' };
    currentlyVisibleWindow.window.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    currentlyVisibleWindow.window.on( 'show', () => {
        // macOS-specific: hide dock icon when tray is showing
        if ( app.dock ) {
            app.dock.hide();
        }
    } );

    currentlyVisibleWindow.window.on( 'hide', () => {
        if ( platform !== LINUX && !programmaticallyTriggeredHideEvent ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
        if ( programmaticallyTriggeredHideEvent ) {
            programmaticallyTriggeredHideEvent = false;
        }
    } );

    // Hide the safeLaunchPadTrayWindow when it loses focus
    currentlyVisibleWindow.window.on( 'blur', () => {
        if ( platform === LINUX ) {
            changeWindowVisibility( currentlyVisibleWindow, store );
        }
    } );

    currentlyVisibleWindow.window.webContents.on( 'did-finish-load', () => {
        logger.info( 'LAUNCH PAD Tray Window: Loaded' );

        if ( isRunningUnpacked ) {
            currentlyVisibleWindow.window.openDevTools( { mode: 'undocked' } );
        }
    } );
};
