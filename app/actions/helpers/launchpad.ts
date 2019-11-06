import { ipcRenderer } from 'electron';
import AutoLaunch from 'auto-launch';

import pkg from '$Package';

export const mockPromise = ( data = null ) =>
    new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve( data );
        }, 1000 );
    } );

export const checkOnBoardingCompleted = () => mockPromise( true );

export const autoLaunchOnStart = async ( enable: boolean ) => {
    const launchpadAutoLaunch = new AutoLaunch( {
        name: pkg.name
    } );
    const isEnabled = await launchpadAutoLaunch.isEnabled();
    if ( !isEnabled && enable ) {
        await launchpadAutoLaunch.enable();
    }

    if ( isEnabled ) {
        await launchpadAutoLaunch.disable();
    }
};
