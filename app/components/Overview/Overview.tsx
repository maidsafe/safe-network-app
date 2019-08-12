import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import { logger } from '$Logger';
import styles from './Overview.css';
import { App, AppManagerState } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
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
            cancelDownload,
            resumeDownload,
            openApp
        } = this.props;
        return Object.values( appList ).map( ( theApplication ) => (
            <ApplicationOverview
                key={theApplication.name}
                {...theApplication}
                application={theApplication}
                downloadAndInstallApp={downloadAndInstallApp}
                unInstallApp={unInstallApp}
                openApp={openApp}
                pauseDownload={pauseDownload}
                cancelDownload={cancelDownload}
                resumeDownload={resumeDownload}
            />
        ) );
    };

    render() {
        const { triggerSetAsTrayWindow, isTrayWindow } = this.props;
        return (
            <div className={styles.container} data-tid="container">
                <span data-istraywindow={isTrayWindow} />
                {this.loadApps()}
            </div>
        );
    }
}
