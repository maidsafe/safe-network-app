import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { App } from '$Definitions/application.d';
import { logger } from '$Logger';
import styles from './MenuItems.css';

interface MenuItemsProps {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
    handleClose: Function;
}

export class MenuItems extends Component<MenuItemsProps> {
    handleDownload = () => {
        const { application, installApp, handleClose } = this.props;
        logger.silly('MeatballMenu: clicked download ', application);
        installApp(application);
        handleClose();
    };

    handleOpen = () => {
        const { application, openApp, handleClose } = this.props;
        logger.silly('MeatballMenu: clicked open ', application);
        openApp(application);
        handleClose();
    };

    handleUninstall = () => {
        const { application, uninstallApp, handleClose } = this.props;
        logger.silly('MeatballMenu: clicked uninstall: ', application);
        uninstallApp(application);
        handleClose();
    };

    render() {
        const {
            name,
            id,
            progress,
            isInstalling,
            isUninstalling,
            isUpdating,
            isDownloading,
            hasUpdate,
            isInstalled,
            installFailed
        } = this.props.application;

        return (
            <React.Fragment>
                <MenuItem dense className={styles['menu-item']}>
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
                {isDownloading && (
                    <React.Fragment>
                        <MenuItem dense className={styles['menu-item']}>
                            Cancel Download
                        </MenuItem>
                        <MenuItem dense className={styles['menu-item']}>
                            Pause Download
                        </MenuItem>
                    </React.Fragment>
                )}
                {isInstalling && (
                    <MenuItem dense className={styles['menu-item']}>
                        Cancel Install
                    </MenuItem>
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
