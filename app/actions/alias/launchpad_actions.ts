import { createAliasedAction } from 'electron-redux';
import { ipcRenderer } from 'electron';

import { Preferences } from '$Definitions/application.d';
import { settingsHandler } from '$Actions/helpers/settings_handler';
import { autoLaunchOnStart } from '../helpers/launchpad';

export const TYPES = {
    ALIAS_SHOULD_ONBOARD: 'ALIAS_SHOULD_ONBOARD',
    ALIAS_STORE_PREFERENCES: 'ALIAS_STORE_PREFERENCES',
    ALIAS_AUTO_LAUNCH: 'ALIAS_AUTO_LAUNCH',
    ALIAS_PIN_TO_TRAY: 'ALIAS_PIN_TO_TRAY',
    ALIAS_SET_AS_TRAY_WINDOW: 'ALIAS_SET_AS_TRAY_WINDOW',
    ALIAS_QUIT_APP: 'ALIAS_QUIT_APP'
};

const updatePreferences = async ( preferences ) => {
    await settingsHandler.updatePreferences( preferences );
};

export const storePreferences = createAliasedAction(
    TYPES.ALIAS_STORE_PREFERENCES,
    ( preferences: Preferences ) => ( {
        type: TYPES.ALIAS_STORE_PREFERENCES,
        payload: updatePreferences( preferences )
    } )
);

export const autoLaunch = createAliasedAction(
    TYPES.ALIAS_AUTO_LAUNCH,
    ( enable: boolean ) => ( {
        type: TYPES.ALIAS_AUTO_LAUNCH,
        payload: autoLaunchOnStart( enable )
    } )
);

export const triggerSetAsTrayWindow = createAliasedAction(
    TYPES.ALIAS_SET_AS_TRAY_WINDOW,
    ( setAsTray: boolean ) => ( {
        type: TYPES.ALIAS_SET_AS_TRAY_WINDOW,
        payload: ( () => {
            ipcRenderer.send( 'set-as-tray-window', setAsTray );
        } )()
    } )
);

export const quitApplication = createAliasedAction(
    TYPES.ALIAS_QUIT_APP,
    () => ( {
        type: TYPES.ALIAS_QUIT_APP,
        payload: ( () => {
            ipcRenderer.send( 'exitSafeNetworkApp' );
        } )()
    } )
);
