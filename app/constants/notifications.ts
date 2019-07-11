import { I18n } from 'react-redux-i18n';
// The Accept and Deny Actions have to be replaced

export const notificationTypes = {
    NO_INTERNET: {
        type: 'NO_INTERNET',
        icon: 'SignalWifiOffIcon',
        message: I18n.t( 'notifications.message.no_internet' ),
        acceptText: I18n.t( 'notifications.acceptText.resume' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' )
    },
    SERVER_TIMED_OUT: {
        type: 'SERVER_TIMED_OUT',
        icon: 'WarningIcon',
        message: ( appName ) =>
            I18n.t( 'notifications.message.server_timeout', { appName } ),
        acceptText: I18n.t( 'notifications.acceptText.retry' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' )
    },
    CLOSE_APP: {
        type: 'CLOSE_APP',
        icon: 'InfoIcon',
        message: ( appName ) =>
            I18n.t( 'notifications.message.close_app', { appName } ),
        acceptText: I18n.t( 'notifications.acceptText.try_again' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' )
    },
    UPDATE_AVAILABLE: {
        type: 'UPDATE_AVAILABLE',
        icon: 'InfoIcon',
        message: ( appName, version ) =>
            I18n.t( 'notifications.message.update_available', {
                appName,
                version
            } ),
        acceptText: I18n.t( 'notifications.acceptText.update_now' ),
        denyText: I18n.t( 'notifications.denyText.skip' )
    },
    ADMIN_PASS_REQ: {
        type: 'ADMIN_PASS_REQ',
        icon: 'LockIcon',
        message: ( appName ) =>
            I18n.t( 'notifications.message.admin_pass_req', { appName } ),
        acceptText: I18n.t( 'notifications.acceptText.try_again' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' )
    },
    RESTART_SYSTEM: {
        type: 'RESTART_SYSTEM',
        icon: 'LoopIcon',
        message: I18n.t( 'notifications.message.restart_system' ),
        acceptText: I18n.t( 'notifications.acceptText.restart' ),
        denyText: I18n.t( 'notifications.denyText.not_now' )
    },
    GLOBAL_FAILURE: {
        type: 'GLOBAL_FAILURE',
        icon: 'WarningIcon',
        message: I18n.t( 'notifications.message.global_failure' ),
        acceptText: I18n.t( 'notifications.acceptText.retry' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' )
    },
    DISC_FULL: {
        type: 'DISC_FULL',
        icon: 'DiscFullIcon',
        message: I18n.t( 'notifications.message.disc_full' ),
        acceptText: I18n.t( 'notifications.acceptText.resume' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' )
    }
};
