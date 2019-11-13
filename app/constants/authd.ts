import path from 'path';
import { app, remote } from 'electron';
import { logger } from '$Logger';
import {
    isRunningOnMac,
    isRunningOnLinux,
    isRunningOnWindows
} from '$Constants/index';

// temp hack for authd
export const getAuthdLocation = () => {
    const isPackaged = app ? app.isPackaged : remote.app.isPackaged;

    if ( !isPackaged ) return path.resolve( '$App/../authd/safe-authd' );

    const exe = app ? app.getPath( 'exe' ) : remote.app.getPath( 'exe' );

    if ( isRunningOnMac ) {
        return path.resolve( exe, '../../Resources/authd/safe-authd' );
    }

    return path.resolve( exe, '../resources/authd/safe-authd' );
};
