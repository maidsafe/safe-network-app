import path from 'path';
import { app, remote } from 'electron';
import { logger } from '$Logger';
import { isRunningOnMac } from '$Constants/index';

// temp hack for authd
export const getAuthdLocation = () => {
    const isPackaged = app ? app.isPackaged : remote.app.isPackaged;

    if ( !isPackaged ) return path.resolve( '$App/../authd/safe-authd' );

    const exe = app ? app.getPath( 'exe' ) : remote.app.getPath( 'exe' );

    return path.resolve( exe, '../../Resources/authd/safe-authd' );
};
