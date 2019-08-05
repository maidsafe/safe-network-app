import React from 'react';
import { Grid, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';

import styles from './ApplicationDetail.css';
import { App } from '$Definitions/application.d';

interface Props {
    match: {
        params: {
            id: string;
        };
    };
    appList: {};
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

export class ApplicationDetail extends React.PureComponent<Props> {
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

        const {
            name,
            author,
            id,
            progress,
            isInstalling,
            isUninstalling,
            isUpdating,
            isDownloading,
            hasUpdate,
            isInstalled,
            installFailed
        } = application;

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
                            {!isInstalled && !isDownloading && !isInstalling && (
                                <Button
                                    onClick={this.handleDownload}
                                    aria-label={`Install ${name}`}
                                >
                                    Install
                                </Button>
                            )}
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
            </React.Fragment>
        );
    }
}
