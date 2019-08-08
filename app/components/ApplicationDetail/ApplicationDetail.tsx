import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';
import styles from './ApplicationDetail.css';
import { App } from '$Definitions/application.d';
import { AppStateButton } from '$Components/AppStateButton';

interface Props {
    match: {
        params: {
            id: string;
        };
    };
    appList: {};
    uninstallApp: Function;
    openApp: Function;
    fetchUpdateInfo: Function;
    installApp: Function;
    application: App;
}

export class ApplicationDetail extends React.Component<Props> {
    componentDidMount() {
        const { appList, match, fetchUpdateInfo } = this.props;
        const applicationId = match.params.id;
        const application = appList[applicationId];

        fetchUpdateInfo( application );
    }

    handleDownload = () => {
        const { application, installApp } = this.props;
        logger.silly( 'ApplicationDetail: clicked download ', application );
        installApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.silly( 'ApplicationDetail: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, uninstallApp } = this.props;
        logger.silly( 'ApplicationDetail: clicked uninstall', application );
        uninstallApp( application );
    };

    render() {
        const { match } = this.props;
        const { appList } = this.props;
        const applicationId = match.params.id;
        const application = appList[applicationId];

        const { name, author } = application;

        return (
            <React.Fragment>
                <Grid item xs={8}>
                    <Typography aria-label="title" variant="h3">
                        {name}
                    </Typography>
                    <Typography aria-label="author" variant="h4">
                        {author}
                    </Typography>
                    <Grid container>
                        <Grid item xs={6}>
                            <AppStateButton
                                {...this.props}
                                application={application}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {application.size}
                        </Grid>
                        <Typography aria-label="description">
                            {application.description}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    App Icon
                </Grid>
                <Grid item xs={12}>
                    {application.updateDescription && (
                        <Markdown
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
            </React.Fragment>
        );
    }
}
