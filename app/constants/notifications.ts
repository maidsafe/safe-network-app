import { I18n } from 'react-redux-i18n';

const prepareNotification = ( title, acceptText, denyText, otherProperties ) => {
    const id: string = Math.random().toString( 36 );

    return {
        id,
        title,
        acceptText,
        denyText,
        ...otherProperties
    };
};

export const notificationTypes = {
    NO_INTERNET: ( appId ) => {
        const title = I18n.t( 'notifications.title.no_internet' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.resume' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );
        const otherProperties = {
            type: 'NO_INTERNET',
            icon: 'SignalWifiOffIcon',
            priority: 'HIGH',
            notificationType: 'Native',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    CLOSE_APP: ( appId, appName, application ) => {
        const title = I18n.t( 'notifications.title.close_app', { appName } );
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
            notificationType: 'Native',
            priority: 'LOW',
            application,
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    CLOSE_APP_ALERT: ( appId, appName, application ) => {
        const title = I18n.t( 'notifications.title.close_app', { appName } );
        const message = I18n.t( 'notifications.message.close_app', { appName } );
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
            notificationType: 'alert',
            message,
            buttons,
            application,
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    SERVER_TIMED_OUT: ( appId, appName ) => {
        const title = I18n.t( 'notifications.title.server_timeout', { appName } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.retry' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );

        const otherProperties = {
            icon: 'WarningIcon',
            type: 'SERVER_TIMED_OUT',
            notificationType: 'Native',
            priority: 'HIGH',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    UPDATE_AVAILABLE: ( appId, appName, version ) => {
        const title = I18n.t( 'notifications.title.update_available', {
            appName,
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
            notificationType: 'Native',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    UPDATE_AVAILABLE_ALERT: ( appId, appName, version ) => {
        const title = I18n.t( 'notifications.title.update_available', {
            appName,
            version
        } );
        const message = I18n.t( 'notifications.message.update_available', {
            appName,
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
            notificationType: 'alert',
            message,
            buttons,
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    ADMIN_PASS_REQ: ( appId, appName ) => {
        const title = I18n.t( 'notifications.title.admin_pass_req', { appName } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.try_again' );
        const denyText = I18n.t(
            'notifications.buttons.denyText.cancel_install'
        );

        const otherProperties = {
            type: 'ADMIN_PASS_REQ',
            priority: 'HIGH',
            icon: 'LockIcon',
            notificationType: 'Native',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    RESTART_SYSTEM: ( appName ) => {
        const title = I18n.t( 'notifications.title.restart_system', { appName } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.restart' );
        const denyText = I18n.t( 'notifications.buttons.denyText.not_now' );

        const otherProperties = {
            type: 'RESTART_SYSTEM',
            notificationType: 'Native',
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
    RESTART_SYSTEM_ALERT: ( appName ) => {
        const title = I18n.t( 'notifications.title.restart_system', { appName } );
        const message = I18n.t( 'notifications.message.restart_system', {
            appName
        } );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.restart' );
        const denyText = I18n.t( 'notifications.buttons.denyText.not_now' );
        const buttons = [denyText, acceptText];

        const otherProperties = {
            type: 'RESTART_SYSTEM_ALERT',
            notificationType: 'alert',
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
    GLOBAL_FAILURE: ( appId ) => {
        const title = I18n.t( 'notifications.title.global_failure' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.retry' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );

        const otherProperties = {
            type: 'GLOBAL_FAILURE',
            notificationType: 'Native',
            icon: 'WarningIcon',
            priority: 'HIGH',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    DISC_FULL: ( appId ) => {
        const title = I18n.t( 'notifications.title.disc_full' );
        const acceptText = I18n.t( 'notifications.buttons.acceptText.resume' );
        const denyText = I18n.t( 'notifications.buttons.denyText.dismiss' );

        const otherProperties = {
            type: 'DISC_FULL',
            notificationType: 'Native',
            icon: 'DiscFullIcon',
            priority: 'HIGH',
            appId
        };

        return prepareNotification(
            title,
            acceptText,
            denyText,
            otherProperties
        );
    },
    UNDOWNLOAD_AND_INSTALL_APP_ALERT: ( appId, appName ) => {
        const title = I18n.t( 'notifications.title.uninstall_app', { appName } );
        const message = I18n.t( 'notifications.message.uninstall_app', {
            appName
        } );
        const acceptText = I18n.t(
            'notifications.buttons.acceptText.uninstall_app'
        );
        const denyText = I18n.t( 'notifications.buttons.denyText.cancel' );
        const buttons = [denyText, acceptText];

        const otherProperties = {
            type: 'UNINSTALL_APP',
            notificationType: 'alert',
            priority: 'HIGH',
            message,
            appId,
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
            notificationType: 'alert',
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
