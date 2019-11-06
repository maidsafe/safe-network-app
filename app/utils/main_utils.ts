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

import { logger } from '$Logger';

const setPreferences = ( store, preferences ) => {
    const { userPreferences, appPreferences } = preferences;
    store.dispatch( setUserPreferences( userPreferences ) );
    store.dispatch( setAppPreferences( appPreferences ) );
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
    let appFolderPath = app.getPath( 'appData' );

    const JsonFileName = isRunningTestCafeProcess
        ? settingsHandlerName.test
        : settingsHandlerName.production;

    appFolderPath = path.resolve(
        appFolderPath,
        pkg.name,
        `${JsonFileName}.json`
    );

    fs.pathExists( appFolderPath, ( error, exists ) => {
        if ( error ) logger.error( error );
        if ( exists ) {
            let preferences = fs.readJsonSync( appFolderPath, {
                throws: false
            } );
            if ( preferences === null ) {
                fs.outputJsonSync( appFolderPath, {
                    ...defaultPreferences
                } );
                preferences = { ...defaultPreferences };
            }
            setPreferences( store, preferences );
            const { pinToMenuBar } = preferences.userPreferences;
            store.dispatch( setAsTrayWindow( pinToMenuBar ) );
        } else
            fs.ensureFile( appFolderPath, ( writeError ) => {
                if ( writeError ) logger.error( writeError );
                fs.outputJsonSync( appFolderPath, {
                    ...defaultPreferences
                } );
                setPreferences( store, defaultPreferences );
            } );
    } );
};
