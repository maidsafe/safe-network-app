import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { logger } from '$Logger';

import styles from './ApplicationOverview.css';
import { ManagedApplication } from '$Definitions/application.d';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: ManagedApplication;
}

export class ApplicationOverview extends Component<Props> {
    handleDownload = () => {
        const { installApp, application } = this.props;
        logger.silly( 'clicked download', application );
        installApp( application );
    };

    handleOpen = () => {
        const { openApp, application } = this.props;
        logger.silly( 'clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { uninstallApp, application } = this.props;

        logger.silly( 'clicked uninstall', application );

        uninstallApp( application );
    };

    render() {
        const { application } = this.props;
        const { name, progress } = application;

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
                    <Button
                        className="download"
                        variant="contained"
                        onClick={this.handleDownload}
                    >
                        {`Download ${name}`}
                    </Button>
                )}

                <Button
                    className="uninstall"
                    variant="contained"
                    onClick={this.handleUninstall}
                >
                    {`Uninstall ${name}`}
                </Button>
            </div>
        );
    }
}
