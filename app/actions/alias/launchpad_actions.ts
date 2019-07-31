import { createAliasedAction } from 'electron-redux';
import { ipcRenderer } from 'electron';

import { Preferences } from '$Definitions/application.d';
import {
    storePreferencesLocally,
    autoLaunchOnStart,
    pinLaunchpadToTray
} from '../helpers/launchpad';

export const TYPES = {
    ALIAS_STORE_PREFERENCES: 'ALIAS_STORE_PREFERENCES',
    ALIAS_AUTO_LAUNCH: 'ALIAS_AUTO_LAUNCH',
    ALIAS_PIN_TO_TRAY: 'ALIAS_PIN_TO_TRAY',
    ALIAS_TO_SET_STANDARD_WINDOW_VISIBILITY:
        'ALIAS_TO_SET_STANDARD_WINDOW_VISIBILITY'
};

export const storePreferences = createAliasedAction(
    TYPES.ALIAS_STORE_PREFERENCES,
    ( preferences: Preferences ) => ( {
        type: TYPES.ALIAS_STORE_PREFERENCES,
        payload: storePreferencesLocally( preferences )
    } )
);

export const autoLaunch = createAliasedAction(
    TYPES.ALIAS_AUTO_LAUNCH,
    ( enable ) => ( {
        type: TYPES.ALIAS_AUTO_LAUNCH,
        payload: autoLaunchOnStart( enable )
    } )
);

export const pinToTray = createAliasedAction(
    TYPES.ALIAS_PIN_TO_TRAY,
    ( enable ) => ( {
        type: TYPES.ALIAS_PIN_TO_TRAY,
        payload: pinLaunchpadToTray( enable )
    } )
);
