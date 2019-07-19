import { createActions } from 'redux-actions';

export const TYPES = {
    CANCEL_APP_INSTALLATION: 'CANCEL_APP_INSTALLATION',
    PAUSE_APP_INSTALLATION: 'PAUSE_APP_INSTALLATION',
    RETRY_APP_INSTALLATION: 'RETRY_APP_INSTALLATION',
    RESET_APP_STATE: 'RESET_APP_STATE',
    SET_APPS: 'SET_APPS'
};

export const {
    cancelAppInstallation,
    pauseAppInstallation,
    retryAppInstallation,
    resetAppState,
    setApps
} = createActions(
    TYPES.CANCEL_APP_INSTALLATION,
    TYPES.PAUSE_APP_INSTALLATION,
    TYPES.RETRY_APP_INSTALLATION,
    TYPES.RESET_APP_STATE,
    TYPES.SET_APPS
);
