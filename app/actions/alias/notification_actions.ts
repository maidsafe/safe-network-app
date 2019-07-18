import { createAction } from 'redux-actions';
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

export const setCurrentStoreForNotificationActions = ( passedStore ) => {
    passedStore.subscribe( () => {
        currentStore = passedStore;
    } );
};

const getCurrentStore = () => currentStore;

const acceptNotify = ( props ) => {
    const store = getCurrentStore();
    switch ( props.type ) {
        case 'NO_INTERNET':
            store.dispatch(
                // @ts-ignore
                installApplicationById( { appId: props.appId } )
            );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( retryAppInstallation( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            store.dispatch( updateApp( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( retryAppInstallation( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'DISC_FULL':
            store.dispatch(
                // @ts-ignore
                installApplicationById( { appId: props.appId } )
            );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        default:
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
    }
};

const denyNotify = ( props ) => {
    const store = getCurrentStore();
    switch ( props.type ) {
        case 'NO_INTERNET':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( cancelAppInstallation( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP':
            store.dispatch( cancelAppInstallation( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            store.dispatch( skipAppUpdate( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( cancelAppInstallation( { appId: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'DISC_FULL':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        default:
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
    }
};

export const acceptNotification = createAliasedAction(
    TYPES.ACCEPT_NOTIFICATION,
    ( props ) => ( {
        // the real action
        type: TYPES.ACCEPT_NOTIFICATION,
        payload: acceptNotify( props )
    } )
);

export const denyNotification = createAliasedAction(
    TYPES.DENY_NOTIFICATION,
    ( props ) => ( {
        // the real action
        type: TYPES.DENY_NOTIFICATION,
        payload: denyNotify( props )
    } )
);
