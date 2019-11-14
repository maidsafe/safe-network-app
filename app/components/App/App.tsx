import * as React from 'react';
import { Grid } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { Link, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import TitleBar from 'frameless-titlebar';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import { I18n } from 'react-redux-i18n';
import MoreIcon from '@material-ui/icons/MoreVert';
import { notificationTypes } from '$Constants/notifications';
import { NotificationsHandler } from '$Components/Notifications/NotificationsHandler';
import { HeaderBar } from '$Components/HeaderBar';
import { logger } from '$Logger';
import {
    SETTINGS,
    ON_BOARDING,
    PERMISSIONS_PENDING,
    HOME
} from '$Constants/routes.json';
import { MeatballMenu } from '$App/components/MeatballMenu';

import { AuthRequest } from '$Definitions/application.d';

import { THEME } from '$Constants/theme';

import styles from './App.css';

const theme = createMuiTheme( THEME );

interface Props {
    children: React.ReactChild;
    isTrayWindow: boolean;
    shouldOnboard: boolean;

    notifications: object;
    notificationCheckBox: boolean;
    acceptNotification: Function;
    denyNotification: Function;
    pushNotification: Function;
    notificationToggleCheckBox: any;

    pathname: string;

    appList: {};
    currentPath: string;
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    updateApp: Function;
    resumeDownload: Function;

    logOutOfNetwork: Function;
    isLoggedIn: boolean;

    pendingRequests: Array<AuthRequest>;
}

export class App extends React.PureComponent<Props> {
    isInAppDetailPage = ( currentPath ) => {
        const {
            appList,
            updateApp,
            unInstallApp,
            openApp,
            downloadAndInstallApp,
            pauseDownload,
            cancelDownload,
            resumeDownload
        } = this.props;

        const applicationId = currentPath.split( '/' )[2];
        const application = appList[applicationId];
        let secondaryAction;

        if ( application.isDownloadingAndInstalling || application.isInstalled ) {
            secondaryAction = (
                <MeatballMenu
                    showAboutAppOption={false}
                    unInstallApp={unInstallApp}
                    openApp={openApp}
                    updateApp={updateApp}
                    downloadAndInstallApp={downloadAndInstallApp}
                    pauseDownload={pauseDownload}
                    cancelDownload={cancelDownload}
                    resumeDownload={resumeDownload}
                    application={application}
                />
            );
        }

        return secondaryAction;
    };

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
            pathname,
            isLoggedIn,
            logOutOfNetwork,
            pendingRequests
        } = this.props;

        // if only one request, lets forwad to perms page...
        if ( pendingRequests.length === 1 && pathname === HOME ) {
            return <Redirect to={PERMISSIONS_PENDING} />;
        }

        const currentPath = pathname;
        // path always starts with a slash

        const baseClassList = [
            !shouldOnboard ? styles.gridContainer : '',
            !isTrayWindow ? styles.standardWindow : styles.trayWindow
        ];

        const targetTitle = currentPath.split( '/' )[1];
        const pageTitle = I18n.t( `pages.${targetTitle}` );

        return (
            <ThemeProvider theme={theme}>
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
                        <HeaderBar
                            pageTitle={pageTitle}
                            isLoggedIn={isLoggedIn}
                            logOutOfNetwork={logOutOfNetwork}
                            shouldOnBoard={currentPath.startsWith( ON_BOARDING )}
                        />
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
            </ThemeProvider>
        );
    }
}
