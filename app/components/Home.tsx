import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { logger } from '$Logger';
import styles from './Home.css';

interface Props {
    installApp: Function;
}
export class Home extends Component<Props> {
    handleDownload = () => {
        const { installApp } = this.props;
        installApp( 'browser' );
        logger.silly( 'clicked download' );
    };

    handleRemove = () => {
        logger.silly( 'clicked uninstall' );
    };

    render() {
        return (
            <div className={styles.container} data-tid="container">
                <h4>
                    https://github.com/maidsafe/ safe_browser/releases/download/
                    v0.12.0/safe-browser-v0.12.0-osx-x64.zip
                </h4>
                <Button variant="contained" onClick={this.handleDownload}>
                    Download Browser
                </Button>

                <Button variant="contained" onClick={this.handleRemove}>
                    Uninstall Browser
                </Button>
            </div>
        );
    }
}
