import path from 'path';
import { remote } from 'electron';
import pkg from '$Package';

export const generateRandomString = (): string => {
    return (
        Math.random()
            .toString( 36 )
            .slice( 2, 15 ) +
        Math.random()
            .toString( 36 )
            .slice( 2, 15 )
    );
};

export const databaseCallBackHandler = ( resolve, reject ) => {
    return ( success, data ) => {
        return success ? resolve( data ) : reject( data );
    };
};

export const camelToTitle = ( camelCase ) =>
    camelCase
        .replace( /([A-Z])/g, ( match ) => ` ${match}` )
        .replace( /^./, ( match ) => match.toUpperCase() )
        .trim();

export const getAppDataPath = () =>
    path.resolve( remote.app.getPath( 'appData' ), pkg.name );

export const getAppStatusText = ( application ) => {
    let progressText = '';
    if ( application.isDownloadingAndInstalling ) {
        progressText = 'Downloading and Installing...';
    }
    if ( application.isDownloadingAndUpdating ) {
        progressText = 'Downloading and Updating...';
    }

    if ( application.isPaused ) {
        progressText = 'Downloading Paused';
    }

    if ( application.isUninstalling ) {
        progressText = 'Uninstalling...';
    }
    return progressText;
};

export const getCommandLineParameter = ( argv, key ) => {
    let value;
    argv.forEach( ( argument ) => {
        if ( argument.indexOf( key ) === 0 ) {
            value = argument.slice( key.length + 1 ).trim();
        }
    } );
    return value;
};
