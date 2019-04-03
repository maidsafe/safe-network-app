import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { logger } from '$Logger';

import styles from './Home.css';
import { ManagedApplication } from '../definitions/application.d';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    userApplications: Array<ManagedApplication>;
    developerApplications: Array<ManagedApplication>;
}
const AppInfo = ( properties ) => {
    const {
        name,
        progress,
        handleRemove,
        handleDownload,
        handleOpen
    } = properties;

    return (
        <div key={name}>
            {progress ? (
                <div>{`Progress! ${progress}`}</div>
            ) : (
                // progress < 1 ? (
                // ) : (
                //     <Button onClick={handleOpen}>
                //         Open it (doesnt go yet)
                //     </Button>
                // )
                <Button variant="contained" onClick={handleDownload}>
                    {`Download ${name}`}
                </Button>
            )}

            <Button variant="contained" onClick={handleRemove}>
                {`Uninstall ${name}`}
            </Button>
        </div>
    );
};
export class Home extends Component<Props> {
    handleDownload = () => {
        const { installApp } = this.props;
        logger.silly( 'clicked download' );
        installApp( 'browser' );
    };

    handleOpen = () => {
        const { openApp } = this.props;
        logger.silly( 'clicked open' );
        openApp( 'browser' );
    };

    handleRemove = () => {
        const { uninstallApp } = this.props;

        logger.silly( 'clicked uninstall' );

        uninstallApp( 'browser' );
    };

    render() {
        const { userApplications } = this.props;

        const apps = [];
        userApplications.forEach( ( theApplication ) => {
            apps.push(
                <AppInfo
                    key={theApplication.name}
                    {...theApplication}
                    handleOpen={this.handleOpen}
                    handleDownload={this.handleDownload}
                    handleRemove={this.handleRemove}
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
