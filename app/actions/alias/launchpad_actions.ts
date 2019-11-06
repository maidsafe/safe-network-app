import { createAliasedAction } from 'electron-redux';
import { ipcRenderer } from 'electron';

import { Preferences } from '$Definitions/application.d';
import { settingsHandler } from '$Actions/helpers/settings_handler';
import { autoLaunchOnStart } from '../helpers/launchpad';

export const TYPES = {
    ALIAS__SHOULD_ONBOARD: 'ALIAS__SHOULD_ONBOARD',
    ALIAS__STORE_PREFERENCES: 'ALIAS__STORE_PREFERENCES',
    ALIAS__AUTO_LAUNCH: 'ALIAS__AUTO_LAUNCH',
    ALIAS__PIN_TO_TRAY: 'ALIAS__PIN_TO_TRAY',
    ALIAS__SET_AS_TRAY_WINDOW: 'ALIAS__SET_AS_TRAY_WINDOW',
    ALIAS__QUIT_APP: 'ALIAS__QUIT_APP'
};

const updatePreferences = async ( preferences ) => {
    await settingsHandler.updatePreferences( preferences );
};

export const storePreferences = createAliasedAction(
    TYPES.ALIAS__STORE_PREFERENCES,
    ( preferences: Preferences ) => ( {
        type: TYPES.ALIAS__STORE_PREFERENCES,
        payload: updatePreferences( preferences )
    } )
);

export const autoLaunch = createAliasedAction(
    TYPES.ALIAS__AUTO_LAUNCH,
    ( enable: boolean ) => ( {
        type: TYPES.ALIAS__AUTO_LAUNCH,
        payload: autoLaunchOnStart( enable )
    } )
);

export const triggerSetAsTrayWindow = createAliasedAction(
    TYPES.ALIAS__SET_AS_TRAY_WINDOW,
    ( setAsTray: boolean ) => ( {
        type: TYPES.ALIAS__SET_AS_TRAY_WINDOW,
        payload: ( () => {
            ipcRenderer.send( 'set-as-tray-window', setAsTray );
        } )()
    } )
);

export const quitApplication = createAliasedAction(
    TYPES.ALIAS__QUIT_APP,
    () => ( {
        type: TYPES.ALIAS__QUIT_APP,
        payload: ( () => {
            ipcRenderer.send( 'exitSafeNetworkApp' );
        } )()
    } )
);
