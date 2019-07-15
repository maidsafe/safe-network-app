import { createAliasedAction } from 'electron-redux';

import { UserPreferences } from '$Definitions/application.d';
import {
    storeUserPreferencesLocally,
    checkOnBoardingCompleted,
    autoLaunchOnStart,
    pinLaunchpadToTray
} from '../helpers/launchpad';

export const TYPES = {
    ALIAS_STORE_USER_PREFERENCES: 'ALIAS_STORE_USER_PREFERENCES',
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
