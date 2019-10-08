import React, { Component } from 'react';
import { Grid, List, Typography } from '@material-ui/core';

import { Redirect } from 'react-router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { logger } from '$Logger';
import styles from './Overview.css';
import { App, AppManagerState } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';
import { ON_BOARDING, HOME } from '$Constants/routes.json';
import { notificationTypes } from '../../constants/notifications';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    resetAppInstallationState: Function;
    cancelDownload: Function;
    pushNotification: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
    installApp: Function;
    appPreferences: {
        shouldOnboard: boolean;
    };
    appList: {
        app: App;
    };
    triggerSetAsTrayWindow: Function;
    isTrayWindow: boolean;
}

export class Overview extends Component<Props> {
    loadApps = () => {
        const {
            appList,
            unInstallApp,
            downloadAndInstallApp,
            pauseDownload,
            resetAppInstallationState,
            cancelDownload,
            pushNotification,
            resumeDownload,
            openApp
        } = this.props;
        return (
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <Typography variant="body2">Applications</Typography>
                    <List className={styles.List}>
                        {Object.values( appList ).map( ( theApplication ) => (
                            <ApplicationOverview
                                key={theApplication.name}
                                {...theApplication}
                                application={theApplication}
                                downloadAndInstallApp={downloadAndInstallApp}
                                unInstallApp={unInstallApp}
                                resetAppInstallationState={
                                    resetAppInstallationState
                                }
                                openApp={openApp}
                                pauseDownload={pauseDownload}
                                cancelDownload={cancelDownload}
                                pushNotification={pushNotification}
                                resumeDownload={resumeDownload}
                            />
                        ) )}
                    </List>
                </Grid>
                {
                    // TODO: If not logged in change header or?
                }
                <Typography variant="body2">Getting Started</Typography>
                <Card // TODO move to css
                    style={{ maxWidth: 250 }}
                >
                    <CardActionArea>
                        <CardMedia
                            // TODO move to css
                            style={{ height: 300 }}
                            // className={}
                            image="https://picsum.photos/250/300"
                            title="Get involved circle"
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="body2"
                                component="span"
                            >
                                Get Involved
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                Create Account
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                Store files, create a site, use Safecoin and
                                more, with a SAFE Network Account.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    render() {
        const {
            triggerSetAsTrayWindow,
            isTrayWindow,
            appPreferences
        } = this.props;

        if ( appPreferences.shouldOnboard ) return <Redirect to={ON_BOARDING} />;

        return (
            <div className={styles.container} data-tid="container">
                <span data-istraywindow={isTrayWindow} />
                {this.loadApps()}
            </div>
        );
    }
}
