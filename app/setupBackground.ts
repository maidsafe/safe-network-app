import { BrowserWindow } from 'electron';
import { download } from 'electron-dl';
import { manageDownloads } from './manageInstallations';
import { logger } from '$Logger';
import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningTestCafeProcess,
    isRunningDevelopment,
    isCI
} from '$Constants';
import { fetchLatestAppVersions } from '$Actions/alias/app_manager_actions';

const BACKGROUND_PROCESS = `file://${__dirname}/bg.html`;

let backgroundProcessWindow = null;
export const setupBackground = async ( store ): Promise<BrowserWindow> =>
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

            // Devtools fix: https://github.com/electron/electron/issues/13008#issuecomment-530837646
            backgroundProcessWindow.webContents.session.webRequest.onBeforeRequest(
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

            backgroundProcessWindow.webContents.on( 'dom-ready', (): void => {
                logger.verbose( 'Background process renderer loaded.' );

                if ( isRunningTestCafeProcess || isCI )
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

                if ( !isRunningTestCafeProcess || isCI ) {
                    // lets update the application versions
                    store.dispatch( fetchLatestAppVersions() );
                }

                return resolve( backgroundProcessWindow );
            } );

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
