import path from 'path';
import { app, Tray, BrowserWindow, ipcMain, screen, App, Menu } from 'electron';
import { Store } from 'redux';
import open from 'open';
import { is } from 'electron-util';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';
import { setAsTrayWindow } from '$Actions/launchpad_actions';

import {
    isRunningTestCafeProcess,
    isRunningUnpacked,
    CONFIG,
    isRunningOnWindows,
    isRunningOnLinux,
    isRunningOnMac
} from '$Constants';

let tray;
let theWindow: Application.Window;

const WINDOW_SIZE = {
    WIDTH: 400,
    HEIGHT: 548
};

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

const setWindowAsVisible = ( setVisible: boolean ): void => {
    if ( !setVisible ) {
        theWindow.hide();
    } else {
        theWindow.show();
        theWindow.focus();
    }
};

const delayShowingWindow = () => {
    setTimeout( () => {
        theWindow.show();
        theWindow.focus();
    }, 200 );
};

const showAsTrayWindow = (): void => {
    logger.info( 'Setting as tray' );

    if ( theWindow.listenerCount( 'blur' ) !== 0 ) {
        theWindow.removeAllListeners( 'blur' );
    }

    theWindow.hide();
    const position = getTrayWindowPosition( theWindow );
    theWindow.setPosition( position.x, position.y, false );
    theWindow.setMovable( false );
    theWindow.setResizable( false );
    delayShowingWindow();

    if ( isRunningOnMac ) {
        theWindow.setWindowButtonVisibility( false );
        app.dock.hide();
    }

    // Hide the theWindow when it loses focus
    theWindow.on( 'blur', () => {
        setWindowAsVisible( false );
    } );
};

const showAsRegularWindow = (): void => {
    logger.info( 'Setting as window' );
    theWindow.removeAllListeners( 'blur' );
    theWindow.hide();
    theWindow.center();
    theWindow.setResizable( false );
    theWindow.setMovable( true );
    delayShowingWindow();

    if ( isRunningOnMac ) {
        app.dock.show();
        theWindow.setWindowButtonVisibility( true );
    }
};

export const createTray = ( store: Store ) => {
    return new Promise( ( resolve ) => {
        const iconPathtray = path.resolve( __dirname, 'tray-icon.png' );

        if ( tray && !tray.isDestroyed() ) {
            tray.destroy();
        }

        tray = new Tray( iconPathtray );

        tray.on( 'double-click', () => {
            setWindowAsVisible( true );
        } );
        tray.on( 'click', ( event ) => {
            setWindowAsVisible( !theWindow.isVisible() );
        } );
        tray.setToolTip( app.getName() );
        resolve();
    } );
};

export const createSafeLaunchPadTrayWindow = (
    store: Store
): Application.Window => {
    theWindow = new BrowserWindow( {
        width: WINDOW_SIZE.WIDTH,
        height: WINDOW_SIZE.HEIGHT,
        show: false,
        frame: true,
        fullscreenable: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } ) as Application.Window;

    if ( is.usingAsar || isRunningTestCafeProcess ) {
        theWindow.loadURL( `file://${CONFIG.APP_HTML_PATH_ASAR}` );
    } else {
        theWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );
    }

    // Devtools fix: https://github.com/electron/electron/issues/13008#issuecomment-530837646
    theWindow.webContents.session.webRequest.onBeforeRequest(
        { urls: ['devtools://devtools/remote/*'] },
        ( details, callback ) => {
            callback( {
                redirectURL: details.url.replace(
                    'devtools://devtools/remote/',
                    'https://chrome-devtools-frontend.appspot.com/'
                )
            } );
        }
    );

    theWindow.webContents.on( 'dom-ready', async () => {
        logger.info( 'Tray Window: Loaded' );

        const { isTrayWindow } = store.getState().launchpad;

        if ( isTrayWindow ) {
            await createTray( store );
            showAsTrayWindow();
        } else {
            showAsRegularWindow();
        }

        if ( isRunningUnpacked ) {
            theWindow.openDevTools( { mode: 'undocked' } );
        }
    } );

    ipcMain.on( 'set-as-tray-window', async ( _event, shouldBeTray: boolean ) => {
        if ( shouldBeTray ) {
            // must be first for dock icon changes
            await createTray( store );
            store.dispatch( setAsTrayWindow( true ) );
            showAsTrayWindow();
        } else {
            // must be first for dock icon changes
            if ( tray ) tray.destroy();
            store.dispatch( setAsTrayWindow( false ) );
            showAsRegularWindow();
        }
    } );

    // prevent links in pulled updates to trigger window opening. Use default
    // OS browser...
    theWindow.webContents.on( 'new-window', function( event, url ) {
        event.preventDefault();
        open( url );
    } );

    return theWindow;
};
