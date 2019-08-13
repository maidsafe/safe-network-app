import * as React from 'react';
import { Grid } from '@material-ui/core';
import { notificationTypes } from '$Constants/notifications';
import { NotificationsHandler } from '$Components/Notifications/NotificationsHandler';
import { HeaderBar } from '$Components/HeaderBar';

interface Props {
    children: React.ReactChild;
    notifications: object;
    notificationCheckBox: boolean;
    acceptNotification: any;
    denyNotification: any;
    pushNotification: any;
    notificationToggleCheckBox: any;
    router: {
        location: {
            pathname: string;
        };
    };
}

export class App extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            children,
            notificationToggleCheckBox,
            acceptNotification,
            denyNotification,
            notificationCheckBox,
            router
        } = this.props;

        const currentPath = router.location.pathname;

        return (
            <React.Fragment>
                <NotificationsHandler
                    notifications={notifications}
                    acceptNotification={acceptNotification}
                    denyNotification={denyNotification}
                    toggleCheckBox={notificationToggleCheckBox}
                    notificationCheckBox={notificationCheckBox}
                />
                <HeaderBar currentPath={currentPath} />
                <Grid container>{children}</Grid>
            </React.Fragment>
        );
    }
}
