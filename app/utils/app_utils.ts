import path from 'path';
import { remote } from 'electron';
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
