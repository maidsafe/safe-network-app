import { createAliasedAction } from 'electron-redux';

import { UserPreferences, AppPreferences } from '$Definitions/application.d';
import {
    storeUserPreferencesLocally,
    storeAppPreferencesLocally,
    autoLaunchOnStart,
    pinLaunchpadToTray
} from '../helpers/launchpad';

export const TYPES = {
    ALIAS_STORE_USER_PREFERENCES: 'ALIAS_STORE_USER_PREFERENCES',
    ALIAS_STORE_APP_PREFERENCES: 'ALIAS_STORE_APP_PREFERENCES',
    ALIAS_AUTO_LAUNCH: 'ALIAS_AUTO_LAUNCH',
    ALIAS_PIN_TO_TRAY: 'ALIAS_PIN_TO_TRAY'
};

export const storeUserPreferences = createAliasedAction(
    TYPES.ALIAS_STORE_USER_PREFERENCES,
    ( userPreferences: UserPreferences ) => ( {
        type: TYPES.ALIAS_STORE_USER_PREFERENCES,
        payload: storeUserPreferencesLocally( userPreferences )
    } )
);

export const storeAppPreferences = createAliasedAction(
    TYPES.ALIAS_STORE_APP_PREFERENCES,
    ( appPreferences: AppPreferences ) => ( {
        type: TYPES.ALIAS_STORE_APP_PREFERENCES,
        payload: storeAppPreferencesLocally( appPreferences )
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
