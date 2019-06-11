import { Notification, UserPreferences } from '../definitions/application.d';

export const TYPES = {
    GET_USER_PREFERENCES: 'GET_USER_PREFERENCES',
    UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
    SHOULD_ONBOARD: 'SHOULD_ONBOARD',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    CHECK_LAUNCHPAD_HAS_UPDATE: 'CHECK_LAUNCHPAD_HAS_UPDATE',
    UPDATE_LAUNCHPAD: 'UPDATE_LAUNCHPAD'
};

export const pushNotification = ( notification: Notification ) => {};

export const getUserPreferences = () => {};

export const storeUserPreferences = ( userPreferences: UserPreferences ) => {};

export const updateUserPreferences = ( userPreferences: UserPreferences ) => {};

export const shouldOnboard = () => {};

export const enableAutoLaunch = () => {};

export const pinLaunchpadToMenu = () => {};

export const releaseLaunchpadFromMenu = () => {};

export const dismissNotification = ( notificationId: string ) => {};

export const checkLaunchpadHasUpdate = () => {};

export const updateLaunchpad = () => {};
