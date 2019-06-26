import { createActions } from 'redux-actions';
import { Store } from 'redux';

export const TYPES = {
    ADD_APPLICATION: 'ADD_APPLICATION',
    CANCEL_INSTALL: 'CANCEL_INSTALL',
    CHECK_FOR_UPDATE_FOR: 'CHECK_FOR_UPDATE_FOR',
    OPEN_APPLICATION: 'OPEN_APPLICATION',
    SET_CURRENT_VERSION: 'SET_CURRENT_VERSION',
    SET_NEXT_VERSION: 'SET_NEXT_VERSION',
    UNINSTALL_APPLICATION: 'UNINSTALL_APPLICATION',
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
    checkForUpdateFor,
    openApplication,
    setCurrentVersion,
    setNextVersion,
    uninstallApplication,
    updateInstallProgress
} = createActions(
    TYPES.ADD_APPLICATION,
    TYPES.CANCEL_INSTALL,
    TYPES.CHECK_FOR_UPDATE_FOR,
    TYPES.OPEN_APPLICATION,
    TYPES.SET_CURRENT_VERSION,
    TYPES.SET_NEXT_VERSION,
    TYPES.UNINSTALL_APPLICATION,
    TYPES.UPDATE_INSTALL_PROGRESS
);
