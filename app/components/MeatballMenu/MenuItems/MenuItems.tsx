import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { App } from '$Definitions/application.d';
import { MenuItemWrapper } from './MenuItemWrapper';
import { logger } from '$Logger';
import styles from './MenuItems.css';

interface MenuItemsProps {
    unInstallApp: Function;
    openApp: Function;
    showAboutAppOption?: boolean;

    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;

    updateApp: Function;
    application: App;

    handleClose: Function;
}

export class MenuItems extends Component<MenuItemsProps> {
    public static defaultProps: Partial<MenuItemsProps> = {
        showAboutAppOption: true
    };

    handleDownload = () => {
        const { application, downloadAndInstallApp, handleClose } = this.props;
        logger.verbose( 'MeatballMenu: clicked download ', application.name );
        downloadAndInstallApp( application );
        handleClose();
    };

    handleOpen = () => {
        const { application, openApp, handleClose } = this.props;
        logger.verbose( 'MeatballMenu: clicked open ', application.name );
        openApp( application );
        handleClose();
    };

    handleUninstall = () => {
        const { application, unInstallApp, handleClose } = this.props;
        logger.verbose( 'MeatballMenu: clicked uninstall: ', application.name );
        unInstallApp( application );
        handleClose();
    };

    handleCancelDownload = () => {
        const { application, cancelDownload, handleClose } = this.props;
        logger.verbose( 'MeatballMenu: clicked cancel', application.name );
        cancelDownload( application );
        handleClose();
    };

    handleResumeDownload = () => {
        const { application, resumeDownload, handleClose } = this.props;
        logger.verbose(
            'MeatballMenu: clicked resume download',
            application.name
        );
        resumeDownload( application );
        handleClose();
    };

    handlePauseDownload = () => {
        const { application, pauseDownload, handleClose } = this.props;
        logger.verbose(
            'MeatballMenu: clicked pause download',
            application.name
        );
        pauseDownload( application );
        handleClose();
    };

    handleUpdate = () => {
        const { application, updateApp } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked update application',
            application
        );
        updateApp( application );
    };

    render() {
        const {
            name,
            id,
            progress,
            isDownloadingAndInstalling,
            isUninstalling,
            isPaused,
            isDownloadingAndUpdating,
            hasUpdate,
            isInstalled,
            installFailed,
            isUpdating
        } = this.props.application;

        const { showAboutAppOption } = this.props;

        return (
            <>
                {showAboutAppOption && (
                    <MenuItemWrapper
                        className={styles['menu-item']}
                        aria-label="about the application"
                    >
                        <Link to={`/application/${id}`}>{`About ${name}`}</Link>
                    </MenuItemWrapper>
                )}
                {!isDownloadingAndInstalling && (
                    <MenuItemWrapper
                        className={styles['menu-item']}
                        aria-label={
                            isInstalled
                                ? `Uninstall ${name}`
                                : `Install ${name}`
                        }
                        onClick={
                            isInstalled
                                ? this.handleUninstall
                                : this.handleDownload
                        }
                    >
                        {isInstalled ? 'Uninstall' : 'Install'}
                    </MenuItemWrapper>
                )}
                {isInstalled && !isUpdating && (
                    <>
                        <MenuItemWrapper
                            className={styles['menu-item']}
                            onClick={this.handleOpen}
                            aria-label={`Open ${name}`}
                        >
                            Open
                        </MenuItemWrapper>
                    </>
                )}
                {isDownloadingAndInstalling && (
                    <MenuItemWrapper
                        aria-label="Cancel Download"
                        className={styles['menu-item']}
                        onClick={this.handleCancelDownload}
                    >
                        Cancel Install
                    </MenuItemWrapper>
                )}
                {!isPaused && isDownloadingAndInstalling && (
                    <MenuItemWrapper
                        aria-label="Pause Download"
                        className={styles['menu-item']}
                        onClick={this.handlePauseDownload}
                    >
                        Pause Download
                    </MenuItemWrapper>
                )}
                {isPaused && isDownloadingAndInstalling && (
                    <MenuItemWrapper
                        aria-label="Resume Download"
                        className={styles['menu-item']}
                        onClick={this.handleResumeDownload}
                    >
                        Resume Download
                    </MenuItemWrapper>
                )}
                {hasUpdate && !isUpdating && (
                    <MenuItemWrapper
                        className={styles['menu-item']}
                        onClick={this.handleUpdate}
                    >
                        Update App
                    </MenuItemWrapper>
                )}
                {hasUpdate && !isUpdating && (
                    <MenuItemWrapper className={styles['menu-item']}>
                        Skip This Update
                    </MenuItemWrapper>
                )}
            </>
        );
    }
}
