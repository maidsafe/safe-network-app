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
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
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
                        <Typography aria-label="author" variant="body2">
                            {author}
                        </Typography>
                        <Grid container className={styles.appInfoActions}>
                            <Grid item>
                                <AppStateButton
                                    {...this.props}
                                    application={application}
                                    showErrorText
                                />
                            </Grid>
                            {!application.error && (
                                <Grid item className={styles.appSize}>
                                    <Typography variant="body2">
                                        {application.size}
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
                    <Grid item xs={12}>
                        {application.updateDescription && (
                            <Markdown
                                className={styles.markdown}
                                aria-label="latest release description"
                                options={{
                                    overrides: {
                                        h1: {
                                            component: Typography,
                                            props: {
                                                variant: 'h3'
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
