import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Box, Fab, Typography, CircularProgress } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import RefreshIcon from '@material-ui/icons/Refresh';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

import styles from './AppStateButton.css';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    showErrorText?: boolean;
    application: App;
}

export class AppStateButton extends React.Component<Props> {
    handleDownload = () => {
        const { application, downloadAndInstallApp } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked download ',
            application.name
        );
        downloadAndInstallApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.verbose( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, unInstallApp } = this.props;
        logger.verbose( 'ApplicationOverview: clicked uninstall', application );
        unInstallApp( application );
    };

    handleCancelDownload = () => {
        const { application, cancelDownload } = this.props;
        logger.verbose( 'ApplicationOverview: clicked cancel', application );
        cancelDownload( application );
    };

    handleResumeDownload = () => {
        const { application, resumeDownload } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked resume download',
            application
        );
        resumeDownload( application );
    };

    handlePauseDownload = () => {
        const { application, pauseDownload } = this.props;
        logger.verbose(
            'ApplicationOverview: clicked pause download',
            application
        );
        pauseDownload( application );
    };

    render() {
        const { application, showErrorText = false } = this.props;

        const {
            isDownloadingAndInstalling,
            isInstalled,
            isOpen, // ?
            isDownloadingAndUpdating, // does this entail installing?
            isUninstalling,
            isPaused,
            hasUpdate,
            installFailed,
            progress,
            error
        } = application;

        let buttonText = isInstalled
            ? I18n.t( `buttons.open` )
            : I18n.t( `buttons.install` );

        let handleClick = isInstalled ? this.handleOpen : this.handleDownload;
        const errorMessage = showErrorText ? error : null;
        let progressButtonIcon;

        const pauseIconButton = (
            <PauseCircleFilledIcon
                aria-label="Pause Button"
                className={styles.pauseButton}
            />
        );

        if ( error ) {
            buttonText = I18n.t( `buttons.retryInstall` );
            progressButtonIcon = (
                <CancelIcon
                    className={styles.cancelButton}
                    aria-label="cancelButton"
                />
            );
        }

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.pause` );
            handleClick = this.handlePauseDownload;
            progressButtonIcon = pauseIconButton;
        }

        if ( isDownloadingAndUpdating ) {
            buttonText = I18n.t( `buttons.pause` );
            progressButtonIcon = pauseIconButton;
        }

        if ( isPaused ) {
            buttonText = I18n.t( `buttons.resume` );
            handleClick = this.handleResumeDownload;
            progressButtonIcon = <RefreshIcon aria-label="refreshButton" />;
        }

        if ( isUninstalling ) {
            buttonText = I18n.t( `buttons.uninstalling` );
        }

        const percentageProgress = progress * 100;

        return (
            <Box className={styles.wrap}>
                {!isInstalled && progressButtonIcon && (
                    <Box className={styles.progressButton}>
                        <Fab
                            color="primary"
                            className={styles.progressFab}
                            onClick={handleClick}
                            aria-label="Application Action Button"
                        >
                            {progressButtonIcon}
                        </Fab>
                        <CircularProgress
                            value={percentageProgress}
                            variant="static"
                            className={`${styles.progress} ${
                                isDownloadingAndInstalling && !isPaused
                                    ? styles.active
                                    : ''
                            }`}
                        />
                    </Box>
                )}
                {!progressButtonIcon && (
                    <Fab
                        className={styles.actionButton}
                        variant="extended"
                        color="primary"
                        onClick={handleClick}
                        aria-label="Application Action Button"
                        disabled={!!isUninstalling}
                    >
                        {buttonText}
                    </Fab>
                )}

                {errorMessage && (
                    <Typography
                        className={styles.error}
                        color="error"
                        variant="body2"
                    >
                        {errorMessage}
                    </Typography>
                )}
            </Box>
        );
    }
}
