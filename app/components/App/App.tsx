import * as React from 'react';
import { Grid } from '@material-ui/core';
import TitleBar from 'frameless-titlebar';
import { notificationTypes } from '$Constants/notifications';
import { NotificationsHandler } from '$Components/Notifications/NotificationsHandler';
import { HeaderBar } from '$Components/HeaderBar';

import styles from './App.css';

interface Props {
    children: React.ReactChild;
    isTrayWindow: boolean;
    shouldOnboard: boolean;
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
            isTrayWindow,
            shouldOnboard,
            notifications,
            children,
            notificationToggleCheckBox,
            acceptNotification,
            denyNotification,
            notificationCheckBox,
            router
        } = this.props;

        const currentPath = router.location.pathname;
        const baseClassList = [
            !shouldOnboard ? styles.gridContainer : '',
            !isTrayWindow ? styles.standardWindow : styles.trayWindow
        ];
        return (
            <div className={baseClassList.join( ' ' )}>
                <div className={styles.titleBarContainer}>
                    {!isTrayWindow && (
                        <TitleBar
                            app="SAFE Network App"
                            theme={{
                                barTheme: 'light',
                                barBackgroundColor: '#eaeaea',
                                menuHighlightColor: '#33c151',
                                showIconDarwin: false
                            }}
                        />
                    )}
                </div>
                <div className={styles.headerBar}>
                    <HeaderBar currentPath={currentPath} />
                </div>
                <div className={styles.containerBase}>
                    <Grid container>
                        <NotificationsHandler
                            notifications={notifications}
                            acceptNotification={acceptNotification}
                            denyNotification={denyNotification}
                            toggleCheckBox={notificationToggleCheckBox}
                            notificationCheckBox={notificationCheckBox}
                        />
                    </Grid>
                    <Grid container className="commonBase">
                        {children}
                    </Grid>
                </div>
            </div>
        );
    }
}
