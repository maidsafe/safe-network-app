import { I18n } from 'react-redux-i18n';
// The Accept and Deny Actions have to be replaced

export const notificationTypes = {
    NO_INTERNET: {
        icon: 'SignalWifiOffIcon',
        message: I18n.t( 'notifications.message.no_internet' ),
        acceptText: I18n.t( 'notifications.acceptText.resume' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    SERVER_TIMED_OUT: {
        icon: 'WarningIcon',
        message: I18n.t( 'notifications.message.server_timeout' ),
        acceptText: I18n.t( 'notifications.acceptText.retry' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    CLOSE_APP: {
        icon: 'InfoIcon',
        message: ( appName ) =>
            I18n.t( 'notifications.message.close_app', { appName } ),
        acceptText: I18n.t( 'notifications.acceptText.try_again' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    UPDATE_AVAILABLE: {
        icon: 'InfoIcon',
        message: ( appName, version ) =>
            I18n.t( 'notifications.message.update_available', {
                appName,
                version
            } ),
        acceptText: I18n.t( 'notifications.acceptText.update_now' ),
        denyText: I18n.t( 'notifications.denyText.skip' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    ADMIN_PASS_REQ: {
        icon: 'LockIcon',
        message: I18n.t( 'notifications.message.admin_pass_req' ),
        acceptText: I18n.t( 'notifications.acceptText.try_again' ),
        denyText: I18n.t( 'notifications.denyText.cancel_install' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    RESTART_SYSTEM: {
        icon: 'LoopIcon',
        message: I18n.t( 'notifications.message.restart_system' ),
        acceptText: I18n.t( 'notifications.acceptText.restart' ),
        denyText: I18n.t( 'notifications.denyText.not_now' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    GLOBAL_FAILURE: {
        icon: 'WarningIcon',
        message: I18n.t( 'notifications.message.global_failure' ),
        acceptText: I18n.t( 'notifications.acceptText.retry' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    },
    DISC_FULL: {
        icon: 'DiscFullIcon',
        message: I18n.t( 'notifications.message.disc_full' ),
        acceptText: I18n.t( 'notifications.acceptText.resume' ),
        denyText: I18n.t( 'notifications.denyText.dismiss' ),
        acceptAction: () => {
            console.log( 'hello' );
        },
        denyAction: () => {
            console.log( 'hello' );
        }
    }
};
