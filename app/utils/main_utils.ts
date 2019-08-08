import { app } from 'electron';
import path from 'path';
import * as fs from 'fs-extra';
import pkg from '$Package';
import {
    setUserPreferences,
    setAppPreferences,
    setAsTrayWindow
} from '$Actions/launchpad_actions';
import {
    isRunningTestCafeProcess,
    getAppFolderPath,
    settingsHandlerName,
    defaultPreferences
} from '$Constants/index';

const setPreferences = ( store, preferences ) => {
    const { userPreferences, appPreferences } = preferences;
    const { pinToMenuBar } = userPreferences;
    store.dispatch( setUserPreferences( userPreferences ) );
    store.dispatch( setAppPreferences( appPreferences ) );
    store.dispatch( setAsTrayWindow( pinToMenuBar ) );
};

export const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require( 'electron-debug' )();

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
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

export const preferencesJsonSetup = async ( store ) => {
    return new Promise( async ( resolve, reject ) => {
        let appFolderPath = app.getPath( 'appData' );

        const JsonFileName = isRunningTestCafeProcess
            ? settingsHandlerName.test
            : settingsHandlerName.production;

        appFolderPath = path.resolve(
            appFolderPath,
            pkg.name,
            `${JsonFileName}.json`
        );
        try {
            fs.pathExists( appFolderPath, ( error, exists ) => {
                if ( error ) console.error( error );
                if ( exists ) {
                    fs.readJson( appFolderPath, ( readError, preferences ) => {
                        if ( readError ) console.error( readError );
                        setPreferences( store, preferences );
                    } );
                } else
                    fs.ensureFile( appFolderPath, ( writeError ) => {
                        if ( writeError ) console.error( writeError );
                        fs.outputJson( appFolderPath, { ...defaultPreferences } );
                        setPreferences( store, defaultPreferences );
                    } );
            } );

            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );
};
