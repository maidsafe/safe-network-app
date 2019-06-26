import { BrowserWindow } from 'electron';
import { download } from 'electron-dl';
import { manageDownloads } from './manageInstallations';
import { logger } from '$Logger';
import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningSpectronTestProcess,
    isRunningDevelopment,
    isCI
} from '$Constants';

const BACKGROUND_PROCESS = `file://${__dirname}/bg.html`;

let backgroundProcessWindow = null;
export const setupBackground = async (
    store,
    mainWindow
): Promise<BrowserWindow> =>
    new Promise( ( resolve, reject ) => {
        logger.info( 'Setting up Background Process' );

        if ( backgroundProcessWindow === null ) {
            logger.info( 'loading bg:', BACKGROUND_PROCESS );

            backgroundProcessWindow = new BrowserWindow( {
                width: 300,
                height: 450,
                show: false,
                frame: false,
                fullscreenable: false,
                resizable: false,
                transparent: true,
                webPreferences: {
                    // partition               : 'persist:safe-tab', // TODO make safe?
                    nodeIntegration: true,
                    // Prevents renderer process code from not running when window is hidden
                    backgroundThrottling: false
                }
            } );

            backgroundProcessWindow.webContents.on(
                'did-finish-load',
                (): void => {
                    logger.verbose( 'Background process renderer loaded.' );

                    if ( isRunningSpectronTestProcess || isCI )
                        return resolve( backgroundProcessWindow );

                    if (
                        isRunningDebug ||
                        isRunningUnpacked ||
                        isRunningDevelopment
                    ) {
                        backgroundProcessWindow.webContents.openDevTools( {
                            mode: 'undocked'
                        } );
                    }
                    return resolve( backgroundProcessWindow );
                }
            );

            // hook in to initiate downloads (can only happen from main process :/ )
            manageDownloads( store, backgroundProcessWindow );

            backgroundProcessWindow.webContents.on(
                'did-fail-load',
                ( event, code, message ) => {
                    logger.error(
                        '>>>>>>>>>>>>>>>>>>>>>>>> Bg process failed to load <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
                    );
                    reject( message );
                }
            );

            backgroundProcessWindow.loadURL( BACKGROUND_PROCESS );

            return backgroundProcessWindow;
        }

        return backgroundProcessWindow;
    } );
