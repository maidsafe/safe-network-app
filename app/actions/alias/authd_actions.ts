import { createAliasedAction } from 'electron-redux';
import { ipcRenderer } from 'electron';
import { createActions } from 'redux-actions';

import { createSafeAccount } from '$Background/createSafeAccount';
import { logInToSafe } from '$Background/logInToSafe';
import { logOutOfSafe } from '$Background/logOutOfSafe';

export const TYPES = {
    ALIAS_LOG_IN_TO_NETWORK: 'ALIAS_LOG_IN_TO_NETWORK',
    LOG_IN_TO_NETWORK: 'LOG_IN_TO_NETWORK',
    ALIAS_LOG_OUT_OF_NETWORK: 'ALIAS_LOG_OUT_OF_NETWORK',
    LOG_OUT_OF_NETWORK: 'LOG_OUT_OF_NETWORK',
    ALIAS_CREATE_ACCOUNT: 'ALIAS_CREATE_ACCOUNT',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_AUTHD_WORKING: 'SET_AUTHD_WORKING'
};

export const { clearError, setAuthdWorking } = createActions(
    TYPES.CLEAR_ERROR,
    TYPES.SET_AUTHD_WORKING
);

export const logInToNetwork = createAliasedAction(
    TYPES.ALIAS_LOG_IN_TO_NETWORK,
    async ( password: string, passphrase: string ) => ( {
        type: TYPES.LOG_IN_TO_NETWORK,
        payload: await logInToSafe( password, passphrase )
    } )
);

export const logOutOfNetwork = createAliasedAction(
    TYPES.ALIAS_LOG_OUT_OF_NETWORK,
    async () => ( {
        type: TYPES.LOG_OUT_OF_NETWORK,
        payload: await logOutOfSafe()
    } )
);

export const createAccount = createAliasedAction(
    TYPES.ALIAS_CREATE_ACCOUNT,
    async ( password: string, passphrase: string ) => ( {
        type: TYPES.CREATE_ACCOUNT,
        payload: await createSafeAccount( password, passphrase )
    } )
);
