import { I18n } from 'react-redux-i18n';

export const NOTIFICATION_TYPES = {
    STANDARD: 'standard',
    ALERT: 'js-alert'
};

export const prepareNotification = ( title, denyText, otherProperties ) => {
    return {
        title,
        denyText,
        ...otherProperties
    };
};

export const notificationTypes = {
    PERMISSION_PENDING: ( authRequest ) => {
        const title = I18n.t( 'notifications.title.permissions_pending', {
            name: authRequest.appId
        } );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.allow' );

        const otherProperties = {
            type: 'PERMISSION_REQUEST',
            icon: 'InfoIcon',
            priority: 'HIGH',
            acceptText,
            notificationType: NOTIFICATION_TYPES.STANDARD
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    NO_INTERNET: () => {
        const title = I18n.t( 'notifications.title.no_internet' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );
        const otherProperties = {
            type: 'NO_INTERNET',
            icon: 'SignalWifiOffIcon',
            priority: 'HIGH',
            notificationType: NOTIFICATION_TYPES.STANDARD
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    NO_INTERNET_APP_IS_INSTALLING: () => {
        const title = I18n.t(
            'notifications.title.no_internet_app_is_installing'
        );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );
        const otherProperties = {
            type: 'NO_INTERNET_INSTALLING_APP',
            icon: 'SignalWifiOffIcon',
            priority: 'HIGH',
            notificationType: NOTIFICATION_TYPES.STANDARD
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    CLOSE_APP: ( application ) => {
        const title = I18n.t( 'notifications.title.close_app', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.try_again' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );
        if ( application === null ) {
            throw new Error( 'Need To Pass application' );
        }

        const otherProperties = {
            type: 'CLOSE_APP',
            icon: 'InfoIcon',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            priority: 'LOW',
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    CLOSE_APP_ALERT: ( application ) => {
        const title = I18n.t( 'notifications.title.close_app', {
            name: application.name
        } );
        const message = I18n.t( 'notifications.message.close_app', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.try_again' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );
        const buttons = [denyText, acceptText];
        if ( application !== null ) {
            throw new Error( 'Need To Pass application' );
        }

        const otherProperties = {
            type: 'CLOSE_APP_ALERT',
            priority: 'LOW',
            notificationType: NOTIFICATION_TYPES.ALERT,
            message,
            buttons,
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    SERVER_TIMED_OUT: ( application ) => {
        const title = I18n.t( 'notifications.title.server_timeout', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.retry' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );

        const otherProperties = {
            icon: 'WarningIcon',
            type: 'SERVER_TIMED_OUT',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            priority: 'HIGH',
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    UPDATE_AVAILABLE: ( application, version ) => {
        const title = I18n.t( 'notifications.title.update_available', {
            name: application.name,
            version
        } );
        const acceptText = I18n.t(
            'notifications.buttons.acceptText.update_now'
        );
        const denyText = I18n.t( 'notifications.buttons.denyText.skip' );

        const otherProperties = {
            type: 'UPDATE_AVAILABLE',
            icon: 'InfoIcon',
            priority: 'LOW',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    UPDATE_CHECK_ERROR: ( application ) => {
        const title = I18n.t( 'notifications.title.update_check_error' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );

        const otherProperties = {
            type: 'UPDATE_CHECK_ERROR',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'WarningIcon',
            priority: 'HIGH',
            application,
            denyText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    UPDATE_AVAILABLE_ALERT: ( application, version ) => {
        const title = I18n.t( 'notifications.title.update_available', {
            name: application.name,
            version
        } );
        const message = I18n.t( 'notifications.message.update_available', {
            name: application.name,
            version
        } );
        const acceptText = I18n.t(
            'notifications.buttons.acceptText.update_now'
        );
        const denyText = I18n.t( 'notifications.buttons.denyText.skip' );
        const learnMore = I18n.t( 'notifications.buttons.other.learn_more' );

        const buttons = [learnMore, denyText, acceptText];

        const otherProperties = {
            priority: 'LOW',
            type: 'UPDATE_AVAILABLE_ALERT',
            notificationType: NOTIFICATION_TYPES.ALERT,
            message,
            buttons,
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    ADMIN_PASS_REQ: ( application ) => {
        const title = I18n.t( 'notifications.title.admin_pass_req', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.try_again' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );

        const otherProperties = {
            type: 'ADMIN_PASS_REQ',
            priority: 'HIGH',
            icon: 'LockIcon',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    RESTART_SYSTEM: ( application ) => {
        const title = I18n.t( 'notifications.title.restart_system', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.restart' );
        const denyText = I18n.t( 'notifications.buttons.denyText.not_now' );

        const otherProperties = {
            type: 'RESTART_SYSTEM',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'LoopIcon',
            priority: 'LOW',
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    RESTART_APP: ( application, appIsDownloading ) => {
        const title = appIsDownloading
            ? I18n.t( 'notifications.title.restart_app_later', {
                name: application.name
            } )
            : I18n.t( 'notifications.title.restart_app_now', {
                name: application.name
            } );
        const acceptText = appIsDownloading
            ? I18n.t( 'notifications.buttons.acceptText.allow_restart' )
            : I18n.t( 'notifications.buttons.acceptText.restart_now' );
        const denyText = appIsDownloading
            ? I18n.t( 'notifications.buttons.denyText.not_now' )
            : I18n.t( 'notifications.buttons.denyText.try_later' );

        const otherProperties = {
            type: 'RESTART_APP',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'LoopIcon',
            priority: 'LOW',
            acceptText,
            application
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    RESTART_SYSTEM_ALERT: ( application ) => {
        const title = I18n.t( 'notifications.title.restart_system', {
            name: application.name
        } );
        const message = I18n.t( 'notifications.message.restart_system', {
            name: application.name
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.restart' );
        const denyText = I18n.t( 'notifications.buttons.denyText.not_now' );
        const buttons = [denyText, acceptText];

        const otherProperties = {
            type: 'RESTART_SYSTEM_ALERT',
            notificationType: NOTIFICATION_TYPES.ALERT,
            priority: 'LOW',
            message,
            buttons,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    GLOBAL_FAILURE: ( newTitle, newDenyText = '' ) => {
        const title = newTitle || I18n.t( 'notifications.title.global_failure' );
        const denyText = I18n.t(
            newDenyText || 'notifications.buttons.denyText.dismiss'
        );

        const otherProperties = {
            type: 'GLOBAL_FAILURE',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'WarningIcon',
            priority: 'HIGH'
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    GLOBAL_INFO: ( newTitle, newDenyText = '' ) => {
        const title = newTitle || I18n.t( 'notifications.title.global_info' );
        const denyText = I18n.t(
            newDenyText || 'notifications.buttons.denyText.dismiss'
        );

        const otherProperties = {
            type: 'GLOBAL_INFO',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'InfoIcon',
            priority: 'HIGH'
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    DISC_FULL: ( application ) => {
        const title = I18n.t( 'notifications.title.disc_full' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.resume' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );

        const otherProperties = {
            type: 'DISC_FULL',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'DiscFullIcon',
            priority: 'HIGH',
            application,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },

    UNINSTALL_APP_ALERT: ( application ) => {
        const title = I18n.t( 'notifications.title.uninstall_app', {
            name: application.name
        } );
        const message = I18n.t( 'notifications.message.uninstall_app', {
            name: application.name
        } );
        const acceptText = I18n.t(
            'notifications.buttons.acceptText.uninstall_app'
        );
        const denyText = I18n.t( 'notifications.buttons.denyText.cancel' );
        const buttons = [denyText, acceptText];

        const otherProperties = {
            type: 'UNINSTALL_APP',
            notificationType: NOTIFICATION_TYPES.ALERT,
            priority: 'HIGH',
            message,
            application,
            buttons,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    },
    CLEARNET_WARNING_ALERT: () => {
        const checkboxLabel = I18n.t( 'notifications.warning.not_again' );
        const title = I18n.t( 'notifications.title.clearnet_warning' );
        const message = I18n.t( 'notifications.message.clearnet_warning' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.continue' );
        const denyText = I18n.t( 'notifications.buttons.denyText.cancel' );
        const buttons = [denyText, acceptText];

        const otherProperties = {
            type: 'CLEARNET_WARNING',
            priority: 'HIGH',
            notificationType: NOTIFICATION_TYPES.ALERT,
            checkboxLabel,
            message,
            buttons,
            acceptText
        };

        return prepareNotification( title, denyText, otherProperties );
    }
};
