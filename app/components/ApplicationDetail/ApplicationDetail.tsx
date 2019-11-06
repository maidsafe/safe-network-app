import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Grid, Fab, Divider, Avatar, Typography } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';
import styles from './ApplicationDetail.css';
import { App } from '$Definitions/application.d';
import { AppStateButton } from '$Components/AppStateButton';
import { AppIcon } from '$Components/AppIcon';

interface Props {
    match: {
        params: {
            id: string;
        };
    };
    appList: {};
    unInstallApp: Function;
    openApp: Function;
    resetAppInstallationState: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    pushNotification: Function;
    resumeDownload: Function;
    updateApp: Function;
    downloadAndInstallApp: Function;
    application: App;
}

export class ApplicationDetail extends React.PureComponent<Props> {
    render() {
        const { match } = this.props;
        const { appList } = this.props;
        const applicationId = match.params.id;
        const application = appList[applicationId];

        const { name, author } = application;

        return (
            <Grid item className={styles.wrap}>
                <Grid container>
                    <Grid item xs={8} className={styles.appInfo}>
                        <Typography aria-label="title" variant="h6">
                            {name}
                        </Typography>
                        <Typography
                            aria-label="author"
                            variant="caption"
                            variantMapping={{ caption: 'h2' }}
                            className={styles.author}
                        >
                            {author}
                        </Typography>
                        <Grid container className={styles.appInfoActions}>
                            <Grid item>
                                <AppStateButton
                                    unInstallApp={this.props.unInstallApp}
                                    openApp={this.props.openApp}
                                    downloadAndInstallApp={
                                        this.props.downloadAndInstallApp
                                    }
                                    pushNotification={
                                        this.props.pushNotification
                                    }
                                    pauseDownload={this.props.pauseDownload}
                                    resumeDownload={this.props.resumeDownload}
                                    resetAppInstallationState={
                                        this.props.resetAppInstallationState
                                    }
                                    updateApp={this.props.updateApp}
                                    application={application}
                                    showAppStatus
                                />
                            </Grid>
                            {!application.error && (
                                <Grid item className={styles.appSize}>
                                    <Typography
                                        variant="caption"
                                        variantMapping={{ caption: 'h2' }}
                                    >
                                        {application.size &&
                                            application.size.replace(
                                                /(\d+)(\w+)/,
                                                '$1 $2'
                                            )}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <AppIcon
                            url={application.iconPath}
                            fontSize="large"
                            className={styles.appIcon}
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.appDesc}>
                        <Typography aria-label="description" variant="body2">
                            {application.description}
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} className={styles.markdownWrap}>
                        {application.updateDescription && (
                            <Markdown
                                className={styles.markdown}
                                aria-label="latest release description"
                                options={{
                                    overrides: {
                                        h1: {
                                            component: Typography,
                                            props: {
                                                variant: 'subtitle1'
                                            }
                                        },
                                        h2: {
                                            component: Typography,
                                            props: {
                                                variant: 'h4'
                                            }
                                        },
                                        h3: {
                                            component: Typography,
                                            props: {
                                                variant: 'h5'
                                            }
                                        },
                                        h4: {
                                            component: Typography,
                                            props: {
                                                variant: 'h6'
                                            }
                                        },
                                        a: {
                                            component: 'a',
                                            props: {
                                                target: '_blank'
                                            }
                                        },
                                        span: {
                                            component: Typography,
                                            props: {
                                                variant: 'body2'
                                            }
                                        }
                                    }
                                }}
                            >
                                {application.updateDescription}
                            </Markdown>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
