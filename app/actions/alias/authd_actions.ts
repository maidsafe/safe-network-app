import { createAliasedAction } from 'electron-redux';
import { ipcRenderer } from 'electron';
import { createActions } from 'redux-actions';

import { createSafeAccount } from '$Background/createSafeAccount';
import { logInToSafe } from '$Background/logInToSafe';
import { logOutOfSafe } from '$Background/logOutOfSafe';
import { allowRequest, denyRequest } from '$Background/authDaemon';

export const TYPES = {
    ALIAS__LOG_IN_TO_NETWORK: 'ALIAS__LOG_IN_TO_NETWORK',
    LOG_IN_TO_NETWORK: 'LOG_IN_TO_NETWORK',
    ALIAS__LOG_OUT_OF_NETWORK: 'ALIAS__LOG_OUT_OF_NETWORK',
    LOG_OUT_OF_NETWORK: 'LOG_OUT_OF_NETWORK',
    ALIAS__CREATE_ACCOUNT: 'ALIAS__CREATE_ACCOUNT',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    CLEAR_ERROR: 'CLEAR_ERROR',

    SET_AUTHD_WORKING: 'SET_AUTHD_WORKING',
    ADD_AUTH_REQUEST_TO_PENDING_LIST: 'ADD_AUTH_REQUEST_TO_PENDING_LIST',
    AUTHD_ALLOW_REQUEST: 'AUTHD_ALLOW_REQUEST',
    ALIAS__AUTHD_ALLOW_REQUEST: 'ALIAS__AUTHD_ALLOW_REQUEST',
    AUTHD_DENY_REQUEST: 'AUTHD_DENY_REQUEST',
    ALIAS__AUTHD_DENY_REQUEST: 'ALIAS__AUTHD_DENY_REQUEST'
};

export const {
    clearError,
    setAuthdWorking,
    addAuthRequestToPendingList
} = createActions(
    TYPES.CLEAR_ERROR,
    TYPES.SET_AUTHD_WORKING,
    TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST
);

export const logInToNetwork = createAliasedAction(
    TYPES.ALIAS__LOG_IN_TO_NETWORK,
    async ( password: string, passphrase: string ) => ( {
        type: TYPES.LOG_IN_TO_NETWORK,
        payload: await logInToSafe( password, passphrase )
    } )
);

export const logOutOfNetwork = createAliasedAction(
    TYPES.ALIAS__LOG_OUT_OF_NETWORK,
    async () => ( {
        type: TYPES.LOG_OUT_OF_NETWORK,
        payload: await logOutOfSafe()
    } )
);

export const createAccount = createAliasedAction(
    TYPES.ALIAS__CREATE_ACCOUNT,
    async ( password: string, passphrase: string ) => ( {
        type: TYPES.CREATE_ACCOUNT,
        payload: await createSafeAccount( password, passphrase )
    } )
);

export const allowAuthRequest = createAliasedAction(
    TYPES.ALIAS__AUTHD_ALLOW_REQUEST,
    async ( authdRequest ) => ( {
        type: TYPES.AUTHD_ALLOW_REQUEST,
        payload: await allowRequest( authdRequest )
    } )
);
export const denyAuthRequest = createAliasedAction(
    TYPES.ALIAS__AUTHD_DENY_REQUEST,
    async ( authdRequest ) => ( {
        type: TYPES.AUTHD_DENY_REQUEST,
        payload: await denyRequest( authdRequest )
    } )
);
