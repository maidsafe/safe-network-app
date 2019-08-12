import { createActions } from 'redux-actions';
import { ipcRenderer } from 'electron';
import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';
import { dismissNotification } from '$Actions/launchpad_actions';
import {
    cancelDownload,
    // TODO: Enable skip app update.
    // skipAppUpdate,
    // updateApp,
    unInstallApp,
    downloadAndInstallApp
} from '$Actions/alias/app_manager_actions';

// import { skipAppUpdate } from '$Actions/app_manager_actions';

export const TYPES = {
    ACCEPT_NOTIFICATION: 'ACCEPT_NOTIFICATION',
    DENY_NOTIFICATION: 'DENY_NOTIFICATION',
    NOTIFICATION_TOGGLE_CHECK_BOX: 'NOTIFICATION_TOGGLE_CHECK_BOX'
};

export const { notificationToggleCheckBox } = createActions(
    TYPES.NOTIFICATION_TOGGLE_CHECK_BOX
);

let currentStore;

export const setCurrentStoreForNotificationActions = ( passedStore ) => {
    passedStore.subscribe( () => {
        currentStore = passedStore;
    } );
};

const getCurrentStore = () => currentStore;

const acceptNotify = ( props ) => {
    if ( props.application ) {
        const { application } = props;
    }
    const store = getCurrentStore();
    switch ( props.type ) {
        case 'NO_INTERNET':
            store
                .dispatch
                // @ts-ignore
                // downloadAndInstallApp( id: props.appId )
                ();
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( downloadAndInstallApp( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP_ALERT':
            ipcRenderer.send( 'close-app' );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP':
            ipcRenderer.send( 'close-app' );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            // store.dispatch( updateApp( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE_ALERT':
            // store.dispatch( updateApp( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM':
            // ipc for  restart system
            ipcRenderer.send( 'restart' );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM_ALERT':
            ipcRenderer.send( 'restart' );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UNDOWNLOAD_AND_INSTALL_APP_ALERT':
            store.dispatch( unInstallApp( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( downloadAndInstallApp( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLEARNET_WARNING_ALERT':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'DISC_FULL':
            store.dispatch(
                // @ts-ignore
                downloadAndInstallApp( props.appId )
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
            store.dispatch( cancelDownload( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP':
            store.dispatch( cancelDownload( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLOSE_APP_ALERT':
            store.dispatch( cancelDownload( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            // store.dispatch( skipAppUpdate( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE_ALERT':
            // store.dispatch( skipAppUpdate( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( cancelDownload( { id: props.appId } ) );
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'RESTART_SYSTEM_ALERT':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'UNDOWNLOAD_AND_INSTALL_APP_ALERT':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'DISC_FULL':
            store.dispatch( dismissNotification( { notificationId: props.id } ) );
            break;
        case 'CLEARNET_WARNING_ALERT':
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
