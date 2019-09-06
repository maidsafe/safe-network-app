import { createActions } from 'redux-actions';
import { ipcRenderer } from 'electron';
import { autoUpdater } from 'electron-updater';
import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';
import { dismissNotification } from '$Actions/launchpad_actions';
import {
    cancelDownload,
    resumeAllDownloads,
    // TODO: Enable skip app update.
    // skipAppUpdate,
    restartApp,
    updateApp,
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
    const { application } = props;
    const store = getCurrentStore();
    const { applicationList } = store.getState().appManager;
    switch ( props.type ) {
        case 'RETRY_INSTALL':
            store.dispatch( downloadAndInstallApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            store.dispatch( updateApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'RESTART_APP':
            store.dispatch( restartApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( downloadAndInstallApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'CLOSE_APP_ALERT':
            ipcRenderer.send( 'close-app' );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'CLOSE_APP':
            ipcRenderer.send( 'close-app' );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE_ALERT':
            // store.dispatch( updateApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'RESTART_SYSTEM':
            // ipc for  restart system
            ipcRenderer.send( 'restart' );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'RESTART_SYSTEM_ALERT':
            ipcRenderer.send( 'restart' );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'UNINSTALL_APP_ALERT':
            store.dispatch( unInstallApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'GLOBAL_FAILURE':
            store.dispatch( downloadAndInstallApp( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'CLEARNET_WARNING_ALERT':
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'DISC_FULL':
            store.dispatch(
                // @ts-ignore
                dismissNotification( { id: props.id } )
            );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        default:
            store.dispatch( dismissNotification( { id: props.id } ) );
    }
};

const denyNotify = ( props ) => {
    const { application } = props;

    logger.info( 'Denying notification' );
    const store = getCurrentStore();
    switch ( props.type ) {
        case 'NO_INTERNET_INSTALLING_APP':
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'NO_INTERNET':
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'SERVER_TIMED_OUT':
            store.dispatch( cancelDownload( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'CLOSE_APP':
            store.dispatch( cancelDownload( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'CLOSE_APP_ALERT':
            store.dispatch( cancelDownload( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE':
            // store.dispatch( skipAppUpdate( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'UPDATE_AVAILABLE_ALERT':
            // store.dispatch( skipAppUpdate( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'ADMIN_PASS_REQ':
            store.dispatch( cancelDownload( application ) );
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        case 'RESTART_APP':
            store.dispatch( dismissNotification( { id: props.id } ) );
            break;
        default:
            store.dispatch( dismissNotification( { id: props.id } ) );
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
