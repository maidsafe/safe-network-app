export const TYPES = {
    FETCH_APPS: 'FETCH_APPS',
    INSTALL_APP: 'INSTALL_APP',
    CANCEL_APP_INSTALLATION: 'CANCEL_APP_INSTALLATION',
    PAUSE_APP_INSTALLATION: 'PAUSE_APP_INSTALLATION',
    RETRY_APP_INSTALLATION: 'RETRY_APP_INSTALLATION',
    UNINSTALL_APP: 'UNINSTALL_APP',
    UPDATE_APP: 'UPDATE_APP',
    SKIP_APP_UPDATE: 'SKIP_APP_UPDATE',
    RESET_APP_STATE: 'RESET_APP'
};

export const fetchApps = () => {};

export const installApp = ( appId: string ) => {};

export const cancelAppInstallation = ( appId: string ) => {};

export const pauseAppInstallation = ( appId: string ) => {};

export const retryAppInstallation = ( appId: string ) => {};

export const uninstallApp = ( appId: string ) => {};

export const checkAppHasUpdate = ( appId: string ) => {};

export const updateApp = ( appId: string ) => {};

export const skipAppUpdate = ( appId: string ) => {};

export const resetAppState = ( appId: string ) => {};
