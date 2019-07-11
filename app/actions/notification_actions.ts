import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';
import {
    retryAppInstallation,
    cancelAppInstallation
} from '$Actions/app_manager_actions';
import { dismissNotification } from '$Actions/launchpad_actions';
import { skipAppUpdate, updateApp } from '$Actions/alias/app_manager_actions';
import { installApplicationById } from '$Actions/helpers/app_manager';

export const TYPES = {
    ACCEPT_NOTIFICATION: 'ACCEPT_NOTIFICATION',
    DENY_NOTIFICATION: 'DENY_NOTIFICATION'
};

let currentStore;

// Can be imported in from background process
export const setCurrentStore = ( passedStore ) => {
    passedStore.subscribe( () => {
        currentStore = passedStore;
    } );
};

const getCurrentStore = () => currentStore;

const acceptNotify = ( payload ) => {
    const store = getCurrentStore();
    switch ( payload.type ) {
        case 'NO_INTERNET':
            // @ts-ignore
            store.dispatch( installApplicationById( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( retryAppInstallation( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;

        case 'CLOSE_APP':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'UPDATE_AVAILABLE':
            store.dispatch( updateApp( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'RESTART_SYSTEM':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( retryAppInstallation( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'DISC_FULL':
            // @ts-ignore
            store.dispatch( installApplicationById( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        default:
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
    }
};

const denyNotify = ( payload ) => {
    const store = getCurrentStore();
    switch ( payload.type ) {
        case 'NO_INTERNET':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( cancelAppInstallation( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'CLOSE_APP':
            store.dispatch( cancelAppInstallation( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'UPDATE_AVAILABLE':
            store.dispatch( skipAppUpdate( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( cancelAppInstallation( { appId: payload.appId } ) );
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'RESTART_SYSTEM':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        case 'DISC_FULL':
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
            break;
        default:
            store.dispatch(
                dismissNotification( {
                    notificationId: payload.notificationId
                } )
            );
    }
};

export const acceptNotification = createAliasedAction(
    TYPES.ACCEPT_NOTIFICATION,
    ( payload: object ) => ( {
        type: TYPES.ACCEPT_NOTIFICATION,
        payload: acceptNotify( payload )
    } )
);

export const denyNotification = createAliasedAction(
    TYPES.DENY_NOTIFICATION,
    ( payload: object ) => ( {
        type: TYPES.DENY_NOTIFICATION,
        payload: denyNotify( payload )
    } )
);
