import { ipcRenderer } from 'electron';
import AutoLaunch from 'auto-launch';

import pkg from '$Package';
import { UserPreferences, AppPreferences } from '$Definitions/application.d';
import { preferenceDatabase } from './preferences_db';

export const mockPromise = ( data = null ) =>
    new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve( data );
        }, 1000 );
    } );

export const fetchUserPreferencesLocally = () =>
    new Promise( async ( resolve, reject ) => {
        try {
            if ( !preferenceDatabase.isReady() ) {
                await preferenceDatabase.init();
            }
            const userPreferences = await preferenceDatabase.getUserPreferences();
            return resolve( userPreferences );
        } catch ( error ) {
            return reject( error );
        }
    } );

export const storeUserPreferencesLocally = ( userPreferences: UserPreferences ) =>
    new Promise( async ( resolve, reject ) => {
        try {
            if ( !preferenceDatabase.isReady() ) {
                await preferenceDatabase.init();
            }
            await preferenceDatabase.updateUserPreferences( userPreferences );
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );

export const checkOnBoardingCompleted = () =>
    new Promise( async ( resolve, reject ) => {
        try {
            if ( !preferenceDatabase.isReady() ) {
                await preferenceDatabase.init();
            }
            const appPreferences = await preferenceDatabase.getAppPreferences();
            return resolve( appPreferences );
        } catch ( error ) {
            return reject( error );
        }
    } );

export const setOnBoardingCompleted = () =>
    new Promise( async ( resolve, reject ) => {
        try {
            if ( !preferenceDatabase.isReady() ) {
                await preferenceDatabase.init();
            }
            const appPreferences: AppPreferences = {
                shouldOnboard: false
            };
            await preferenceDatabase.updateAppPreferences( appPreferences );
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
    if ( enable ) {
        ipcRenderer.send( 'pinToTray' );
    } else {
        ipcRenderer.send( 'releaseFromTray' );
    }
};
