import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';

import styles from './ApplicationDetail.css';
import { App } from '$Definitions/application.d';

interface Props {
    match: {
        params: {};
    };
    appList: {};
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

export class ApplicationDetail extends Component<Props> {
    // handleDownload = () => {
    //     const { application, installApp } = this.props;
    //     logger.silly( 'ApplicationDetail: clicked download ', application );
    //     installApp( application );
    // };
    //
    // handleOpen = () => {
    //     const { application, openApp } = this.props;
    //     logger.silly( 'ApplicationDetail: clicked open', application );
    //     openApp( application );
    // };
    //
    // handleUninstall = () => {
    //     const { application, uninstallApp } = this.props;
    //     logger.silly( 'ApplicationDetail: clicked uninstall', application );
    //     uninstallApp( application );
    // };

    render() {
        const { match } = this.props;

        const { appList } = this.props;

        const applicationId = match.params.id;
        const application = appList[applicationId];

        console.log('aaaa', appList, applicationId, application);
        return (
            <React.Fragment>
                <Grid container spacing={3}>
                    {/* progress ? (
                        <div>{`Progress! ${progress}`}</div>
                    ) : (
                        // progress < 1 ? (
                        // ) : (
                        //     <Button onClick={handleOpen}>
                        //         Open it (doesnt go yet)
                        //     </Button>
                        // )
                        <Button
                            className="download"
                            variant="contained"
                            onClick={handleDownload}
                        >
                            {`Download ${name}`}
                        </Button>
                    ) */}

                    <Grid item xs={6}>
                        {application.name}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
