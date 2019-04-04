import React, { Component } from 'react';
import { logger } from '$Logger';

import styles from './Overview.css';
import { ManagedApplication } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    userApplications: Array<ManagedApplication>;
    developerApplications: Array<ManagedApplication>;
}

export class Overview extends Component<Props> {
    handleDownload = ( application ) => {
        const { installApp } = this.props;

        installApp( application );
    };

    handleOpen = ( application ) => {
        const { openApp } = this.props;
        openApp( application );
    };

    handleRemove = ( application ) => {
        const { uninstallApp } = this.props;

        uninstallApp( application );
    };

    render() {
        const {
            userApplications,
            uninstallApp,
            installApp,
            openApp
        } = this.props;

        const apps = [];
        userApplications.forEach( ( theApplication ) => {
            apps.push(
                <ApplicationOverview
                    key={theApplication.name}
                    {...theApplication}
                    application={theApplication}
                    installApp={installApp}
                    uninstallApp={uninstallApp}
                    openApp={openApp}
                />
            );
        } );
        return (
            <div className={styles.container} data-tid="container">
                {apps}
            </div>
        );
    }
}
