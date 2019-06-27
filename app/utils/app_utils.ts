import os from 'os';
import path from 'path';

import pkg from '$Package';

export const generateRandomString = (): string => {
    return (
        Math.random()
            .toString( 36 )
            .substring( 2, 15 ) +
        Math.random()
            .toString( 36 )
            .substring( 2, 15 )
    );
};

export const getAppFolderPath = () => {
    const platform = os.platform();
    const appName = pkg.name;
    let userData;
    if ( platform === 'win32' ) {
        userData = path.join( process.env.APPDATA, appName );
    } else if ( platform === 'darwin' ) {
        userData = path.join(
            process.env.HOME,
            'Library',
            'Application Support',
            appName
        );
    } else {
        userData = path.join( 'var', 'local', appName );
    }
    return userData;
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
