import { ipcMain, app } from 'electron';
import * as cp from 'child_process';

import { logger } from '$Logger';
import { safeAppUpdater } from '$App/manageInstallations/safeAppUpdater';

export const setupIPCListeners = ( store ) => {
    const allApps = store.getState().appManager.applicationList;

    Object.keys( allApps ).forEach( ( theApp ) => {
        const application = allApps[theApp];
        safeAppUpdater.checkAppsForUpdate( application );
    } );

    // IPC handlers from actions.
    ipcMain.on( 'restart', () => {
        if (
            process.platform !== 'linux' &&
            process.platform !== 'darwin' &&
            process.platform !== 'win32'
        ) {
            throw new Error( 'Unknown or unsupported OS!' );
        }
        let finalcmd;
        if ( process.platform !== 'linux' && process.platform !== 'win32' ) {
            const cmdarguments = ['shutdown'];

            cmdarguments.push( '-r' );

            finalcmd = cmdarguments.join( ' ' );
        }

        if ( process.platform === 'darwin' ) {
            finalcmd = `osascript -e 'tell app "System Events" to shut down'`;
        }

        cp.exec( finalcmd, ( error, stdout, stderr ) => {
            if ( error ) {
                console.error( error );
                return;
            }
            // console.log(stdout);
            app.exit( 0 );
        } );
    } );

    ipcMain.on( 'close-app', ( _event, application ) => {
        console.log( 'close-app' );
        if (
            process.platform !== 'linux' &&
            process.platform !== 'darwin' &&
            process.platform !== 'win32'
        ) {
            throw new Error( 'Unknown or unsupported OS!' );
        }

        const appName = application.name;
        console.log( `Should contact ${appName} and close the app` );
    } );

    ipcMain.on( 'onClickQuitApp', () => {
        if ( process.platform !== 'darwin' ) {
            app.quit();
        }
    } );

    ipcMain.on( 'exitSafeNetworkApp', () => {
        app.quit();
    } );

    ipcMain.on( 'checkApplicationsForUpdate', ( _event, application ) => {
        safeAppUpdater.checkAppsForUpdate( application );
    } );

    ipcMain.on( 'updateApplication', ( _event, application ) => {
        safeAppUpdater.updateApplication( application );
    } );
};
