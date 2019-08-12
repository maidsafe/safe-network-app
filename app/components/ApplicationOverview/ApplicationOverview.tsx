import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { MeatballMenu } from '$Components/MeatballMenu';
// import { logger } from '$Logger';
import { AppStateButton } from '$Components/AppStateButton';
import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
    application: App;
}

export class ApplicationOverview extends React.PureComponent<Props> {
    render() {
        const { application } = this.props;

        return (
            <React.Fragment>
                <Grid container alignItems="center">
                    <Grid item xs={7} className={styles.name}>
                        <Link to={`/application/${application.id}`}>
                            {application.name}
                        </Link>
                    </Grid>
                    <Grid item xs={3}>
                        <AppStateButton {...this.props} />
                    </Grid>
                    <Grid item xs={2}>
                        <MeatballMenu {...this.props} />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
