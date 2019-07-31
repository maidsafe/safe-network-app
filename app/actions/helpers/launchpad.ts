import { ipcRenderer } from 'electron';
import AutoLaunch from 'auto-launch';

import pkg from '$Package';
import { Preferences } from '$Definitions/application.d';
import { preferenceDatabase } from './preferences_db';

export const mockPromise = ( data = null ) =>
    new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve( data );
        }, 1000 );
    } );

export const initiliseApplication = () =>
    new Promise( async ( resolve ) => {
        try {
            await preferenceDatabase.init();
            console.warn( 'Initialised database' );
            resolve();
        } catch ( error ) {
            console.warn( 'Unable to initialise application', error );
            resolve();
        }
    } );

export const fetchPreferencesLocally = (): Promise<Preferences> =>
    new Promise( async ( resolve, reject ) => {
        try {
            const preferences = await preferenceDatabase.getPreferences();
            return resolve( preferences );
        } catch ( error ) {
            return reject( error );
        }
    } );

export const storePreferencesLocally = ( preferences: Preferences ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            await preferenceDatabase.updatePreferences( preferences );
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );

export const autoLaunchOnStart = ( enable ) =>
    new Promise( async ( resolve ) => {
        try {
            const launchpadAutoLaunch = new AutoLaunch( {
                name: pkg.name
            } );
            const isEnabled = await launchpadAutoLaunch.isEnabled();
            if ( !isEnabled && enable ) {
                await launchpadAutoLaunch.enable();
                return resolve();
            }

            if ( isEnabled ) {
                await launchpadAutoLaunch.disable();
            }
            return resolve();
        } catch ( error ) {
            // TODO: Show error notification
            return resolve();
        }
    } );

export const pinLaunchpadToTray = ( enable ) => {
    ipcRenderer.send( 'pinToTray', enable );
};
