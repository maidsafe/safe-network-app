import { createActions } from 'redux-actions';

export const TYPES = {
    CANCEL_APP_INSTALLATION: 'CANCEL_APP_INSTALLATION',
    PAUSE_APP_INSTALLATION: 'PAUSE_APP_INSTALLATION',
    RETRY_APP_INSTALLATION: 'RETRY_APP_INSTALLATION',
    RESET_APP_STATE: 'RESET_APP_STATE'
};

export const {
    cancelAppInstallation,
    pauseAppInstallation,
    retryAppInstallation,
    resetAppState
} = createActions(
    TYPES.CANCEL_APP_INSTALLATION,
    TYPES.PAUSE_APP_INSTALLATION,
    TYPES.RETRY_APP_INSTALLATION,
    TYPES.RESET_APP_STATE
);
