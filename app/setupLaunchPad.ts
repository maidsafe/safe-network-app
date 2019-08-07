import path from 'path';
import { app, Tray, BrowserWindow, ipcMain, screen, App, Menu } from 'electron';
import { Store } from 'redux';
import open from 'open';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';
import { setAsTrayWindow } from '$Actions/launchpad_actions';

import {
    isRunningUnpacked,
    CONFIG,
    isRunningOnWindows,
    isRunningOnLinux,
    isRunningOnMac
} from '$Constants';

let tray;
let safeLaunchPadStandardWindow: Application.Window;
let safeLaunchPadTrayWindow: Application.Window;
let theWindow: Application.Window;

const getTrayWindowPosition = (
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

    if ( isRunningOnLinux ) {
        x = Math.round( screenBounds.width - safeLaunchPadWindowBounds.width );
    }

    // Position safeLaunchPadWindow 4 pixels vertically below the tray icon
    let y = Math.round( trayBounds.y + trayBounds.height + 4 );

    if ( isRunningOnWindows ) {
        y = Math.round(
            screenBounds.height - safeLaunchPadWindowBounds.height - 40
        );
    }

    return { x, y };
};

const showAsTrayWindow = (): void => {
    logger.info( 'Setting as tray' );
    const position = getTrayWindowPosition( theWindow );
    theWindow.setPosition( position.x, position.y, false );

    theWindow.setMovable( false );
    theWindow.setResizable( false );
    theWindow.show();
    theWindow.focus();

    if ( isRunningOnMac ) {
        theWindow.setWindowButtonVisibility( false );
        app.dock.hide();
    }
};

const showAsRegularWindow = (): void => {
    logger.info( 'Setting as window' );
    theWindow.center();
    theWindow.show();
    theWindow.focus();
    theWindow.setResizable( true );
    theWindow.setMovable( true );

    if ( isRunningOnMac ) {
        app.dock.show();
        theWindow.setWindowButtonVisibility( true );
    }
};

const setWindowAsVisible = ( setVisible: boolean ): void => {
    if ( !setVisible ) {
        theWindow.hide();
    } else {
        theWindow.show();
        theWindow.focus();
    }
};

export const createTray = ( store: Store ): void => {
    const iconPathtray = path.resolve( __dirname, 'tray-icon.png' );

    tray = new Tray( iconPathtray );

    tray.on( 'double-click', () => {
        setWindowAsVisible( true );
    } );
    tray.on( 'click', ( event ) => {
        setWindowAsVisible( true );

        // Show devtools when command clicked
        if (
            safeLaunchPadStandardWindow &&
            safeLaunchPadStandardWindow.isVisible() &&
            process.defaultApp &&
            event.metaKey
        ) {
            safeLaunchPadStandardWindow.openDevTools( { mode: 'undocked' } );
        }
    } );
    tray.setToolTip( app.getName() );
};

export const createSafeLaunchPadTrayWindow = (
    store: Store
): Application.Window => {
    safeLaunchPadTrayWindow = new BrowserWindow( {
        width: 495,
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

    theWindow = safeLaunchPadTrayWindow;

    safeLaunchPadTrayWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    // Hide the safeLaunchPadTrayWindow when it loses focus
    safeLaunchPadTrayWindow.on( 'blur', () => {
        const { isTrayWindow } = store.getState().launchpad;

        if ( ( isRunningOnWindows || isRunningOnLinux ) && isTrayWindow ) {
            setWindowAsVisible( false );
        }
    } );

    safeLaunchPadTrayWindow.webContents.on( 'did-finish-load', () => {
        logger.info( 'Tray Window: Loaded' );

        const { isTrayWindow } = store.getState().launchpad;

        if ( isTrayWindow ) {
            showAsTrayWindow();
        } else {
            showAsRegularWindow();
        }

        if ( isRunningUnpacked ) {
            safeLaunchPadTrayWindow.openDevTools( { mode: 'undocked' } );
        }
    } );

    ipcMain.on( 'set-as-tray-window', ( _event, shouldBeTray: boolean ) => {
        if ( shouldBeTray ) {
            // must be first for dock icon changes
            store.dispatch( setAsTrayWindow( true ) );
            showAsTrayWindow();
        } else {
            // must be first for dock icon changes
            store.dispatch( setAsTrayWindow( false ) );
            showAsRegularWindow();
        }
    } );

    // prevent links in pulled updates to trigger window opening. Use default
    // OS browser...
    safeLaunchPadTrayWindow.webContents.on( 'new-window', function( event, url ) {
        event.preventDefault();
        open( url );
    } );

    return safeLaunchPadTrayWindow;
};
