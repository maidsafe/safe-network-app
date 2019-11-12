import path from 'path';
import { isRunningOnMac } from '$Constants/index';

// temp hack for authd
export const getAuthdLocation = () => {
    // if ( isRunningOnMac ) {
    return path.resolve( '$App/../authd/safe-authd' );
    // }
};
