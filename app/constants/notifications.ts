import { I18n } from 'react-redux-i18n';

export const NOTIFICATION_TYPES = {
    STANDARD: 'standard',
    ALERT: 'js-alert'
};

export const prepareNotification = (
    title,
    acceptText,
    denyText,
    otherProperties
) => {
    return {
        title,
        acceptText,
        denyText,
        ...otherProperties
    };
};

export const notificationTypes = {
    NO_INTERNET: ( application ) => {
        const title = I18n.t( 'notifications.title.no_internet' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.resume' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );
        const otherProperties = {
            type: 'NO_INTERNET',
            icon: 'SignalWifiOffIcon',
            priority: 'HIGH',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            priority: 'LOW'
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            buttons
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    GLOBAL_FAILURE: ( application ) => {
        const title = I18n.t( 'notifications.title.global_failure' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.retry' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );

        const otherProperties = {
            type: 'GLOBAL_FAILURE',
            notificationType: NOTIFICATION_TYPES.STANDARD,
            icon: 'WarningIcon',
            priority: 'HIGH',
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            application
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            buttons
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
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
            buttons
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    }
};
