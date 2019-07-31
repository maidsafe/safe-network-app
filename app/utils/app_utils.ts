import { remote } from 'electron';

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
    if ( remote && remote.app ) {
        return remote.app.getPath( 'appData' );
    }
    return null;
};

export const camelToTitle = ( camelCase ) =>
    camelCase
        .replace( /([A-Z])/g, ( match ) => ` ${match}` )
        .replace( /^./, ( match ) => match.toUpperCase() )
        .trim();
