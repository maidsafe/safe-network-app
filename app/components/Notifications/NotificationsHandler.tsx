import React, { Component } from 'react';
import { Notification } from '$Components/Notifications/Notification';
import { NotificationAlert } from '$Components/Notifications/Notification_Alert';
import { logger } from '$Logger';

interface Props {
    notificationCheckBox: boolean;
    notifications: Record<string, any>;
    acceptNotification: any;
    denyNotification: any;
    toggleCheckBox: any;
}

export class NotificationsHandler extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            acceptNotification,
            denyNotification,
            toggleCheckBox,
            notificationCheckBox
        } = this.props;

        const notificationKeys = Object.keys( notifications );
        let lastNotificationIndex = notificationKeys.length - 1;
        if ( lastNotificationIndex >= 0 ) {
            let latestNotificationId: string =
                notificationKeys[lastNotificationIndex];
            let latestNotification: Record<string, any> =
                notifications[latestNotificationId];
            while (
                // eslint-disable-next-line no-plusplus
                lastNotificationIndex-- &&
                latestNotification.priority === 'LOW'
            ) {
                latestNotificationId = notificationKeys[lastNotificationIndex];
                latestNotification = notifications[latestNotificationId];
            }

            latestNotification.icon = latestNotification.icon || 'InfoIcon';
            latestNotification.acceptText =
                latestNotification.acceptText || 'RESUME';
            latestNotification.denyText =
                latestNotification.denyText || 'DISMISS';
            latestNotification.title =
                latestNotification.title || 'Uhh Ohh Something Went Wrong!';

            if ( latestNotification.notificationType === 'standard' ) {
                return (
                    <Notification
                        latestNotification={latestNotification}
                        acceptNotification={acceptNotification}
                        denyNotification={denyNotification}
                    />
                );
            }
            if ( latestNotification.notificationType === 'js-alert' ) {
                return (
                    <NotificationAlert
                        latestNotification={latestNotification}
                        acceptNotification={acceptNotification}
                        denyNotification={denyNotification}
                        toggleCheckBox={toggleCheckBox}
                        notificationCheckBox={notificationCheckBox}
                    />
                );
            }
        }
        return <div />;
    }
}
