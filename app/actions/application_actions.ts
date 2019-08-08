import { createActions } from 'redux-actions';
import { Store } from 'redux';

export const TYPES = {
    ADD_APPLICATION: 'ADD_APPLICATION',

    CANCEL_INSTALL: 'CANCEL_INSTALL',
    INSTALL_APP_PENDING: 'INSTALL_APP_PENDING',
    INSTALL_APP_SUCCESS: 'INSTALL_APP_SUCCESS',
    INSTALL_APP_FAILURE: 'INSTALL_APP_FAILURE',

    CHECK_FOR_UPDATE_FOR: 'CHECK_FOR_UPDATE_FOR',
    SET_CURRENT_VERSION: 'SET_CURRENT_VERSION',
    SET_NEXT_VERSION: 'SET_NEXT_VERSION',
    SET_NEXT_RELEASE_DESCRIPTION: 'SET_NEXT_RELEASE_DESCRIPTION',
    UPDATE_INSTALL_PROGRESS: 'UPDATE_INSTALL_PROGRESS'
};

let currentStore: Store;

export const getCurrentStore = () => currentStore;
export const setCurrentStore = ( passedStore: Store ): void => {
    currentStore = passedStore;
};

export const {
    addApplication,

    cancelInstall,

    installAppPending,
    installAppSuccess,
    installAppFailure,

    checkForUpdateFor,
    setCurrentVersion,
    setNextVersion,
    setNextReleaseDescription,
    updateInstallProgress
} = createActions(
    TYPES.ADD_APPLICATION,
    TYPES.CANCEL_INSTALL,

    TYPES.INSTALL_APP_PENDING,
    TYPES.INSTALL_APP_SUCCESS,
    TYPES.INSTALL_APP_FAILURE,

    TYPES.CHECK_FOR_UPDATE_FOR,
    TYPES.SET_CURRENT_VERSION,
    TYPES.SET_NEXT_VERSION,
    TYPES.SET_NEXT_RELEASE_DESCRIPTION,
    TYPES.UPDATE_INSTALL_PROGRESS
);
