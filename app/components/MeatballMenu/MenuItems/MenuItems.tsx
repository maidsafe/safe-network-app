import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { App } from '$Definitions/application.d';
import { logger } from '$Logger';
import styles from './MenuItems.css';

interface MenuItemsProps {
    unInstallApp: Function;
    openApp: Function;

    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;

    application: App;

    handleClose: Function;
}

export class MenuItems extends Component<MenuItemsProps> {
    handleDownload = () => {
        const { application, downloadAndInstallApp, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked download ', application );
        downloadAndInstallApp( application );
        handleClose();
    };

    handleOpen = () => {
        const { application, openApp, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked open ', application );
        openApp( application );
        handleClose();
    };

    handleUninstall = () => {
        const { application, unInstallApp, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked uninstall: ', application );
        unInstallApp( application );
        handleClose();
    };

    handleCancelDownload = () => {
        const { application, cancelDownload, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked cancel', application );
        cancelDownload( application );
        handleClose();
    };

    handleResumeDownload = () => {
        const { application, resumeDownload, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked resume download', application );
        resumeDownload( application );
        handleClose();
    };

    handlePauseDownload = () => {
        const { application, pauseDownload, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked pause download', application );
        pauseDownload( application );
        handleClose();
    };

    render() {
        const {
            name,
            id,
            progress,
            isDownloadingAndInstalling,
            isUninstalling,
            isDownloadingAndUpdating,
            hasUpdate,
            isInstalled,
            installFailed
        } = this.props.application;

        return (
            <React.Fragment>
                <MenuItem
                    dense
                    className={styles['menu-item']}
                    aria-label="about the application"
                >
                    <Link to={`/application/${id}`}>{`About ${name}`}</Link>
                </MenuItem>
                <MenuItem
                    dense
                    className={styles['menu-item']}
                    onClick={
                        isInstalled ? this.handleUninstall : this.handleDownload
                    }
                >
                    {isInstalled ? 'Uninstall' : 'Install'}
                </MenuItem>
                {isInstalled && (
                    <React.Fragment>
                        <MenuItem
                            dense
                            className={styles['menu-item']}
                            onClick={() =>
                                logger.warn(
                                    'No method setup for checking for updates as yet.'
                                )
                            }
                        >
                            Check For Updates
                        </MenuItem>
                        <MenuItem
                            dense
                            className={styles['menu-item']}
                            onClick={this.handleOpen}
                        >
                            Open
                        </MenuItem>
                    </React.Fragment>
                )}
                {isDownloadingAndInstalling && (
                    <React.Fragment>
                        <MenuItem dense className={styles['menu-item']}>
                            Cancel Install
                        </MenuItem>
                        <MenuItem dense className={styles['menu-item']}>
                            Pause Download
                        </MenuItem>
                    </React.Fragment>
                )}
                {installFailed && (
                    <MenuItem dense className={styles['menu-item']}>
                        Retry Install
                    </MenuItem>
                )}
                {hasUpdate && (
                    <MenuItem dense className={styles['menu-item']}>
                        Skip This Update
                    </MenuItem>
                )}
            </React.Fragment>
        );
    }
}
