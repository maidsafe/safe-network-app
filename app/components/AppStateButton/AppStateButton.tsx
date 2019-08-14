import React from 'react';
import { I18n } from 'react-redux-i18n';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
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
        const { application } = this.props;

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
        let secondButtonText = I18n.t( `buttons.cancelInstall` );
        let showSecondButton =
            isDownloadingAndInstalling || isDownloadingAndUpdating;

        let handleClick = isInstalled ? this.handleOpen : this.handleDownload;
        let handleSecondButtonClick = () => {}; // otherwise nothing
        const errorMessage = error;

        if ( error ) {
            buttonText = I18n.t( `buttons.retryInstall` );
        }

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelInstall` );

            handleClick = this.handlePauseDownload;
            handleSecondButtonClick = this.handleCancelDownload;
        }

        if ( isDownloadingAndUpdating ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelUpdate` );
        }

        if ( isPaused ) {
            buttonText = I18n.t( `buttons.resume` );
            secondButtonText = I18n.t( `buttons.cancelInstall` );
            handleClick = this.handleResumeDownload;
            handleSecondButtonClick = this.handleCancelDownload;
        }

        if ( isUninstalling ) {
            buttonText = I18n.t( `buttons.uninstalling` );
            showSecondButton = false;
        }

        const precentageProgress = progress * 100;

        return (
            <React.Fragment>
                {errorMessage && (
                    <Typography color="error">{errorMessage}</Typography>
                )}
                <Button
                    onClick={handleClick}
                    aria-label="Application Action Button"
                    disabled={!!isUninstalling}
                >
                    {buttonText}
                </Button>
                {progress > 0 && !isInstalled && (
                    <CircularProgress
                        value={precentageProgress}
                        variant="determinate"
                    />
                )}
                {showSecondButton && (
                    <Button
                        onClick={handleSecondButtonClick}
                        aria-label="Application Secondary Action Button"
                    >
                        {secondButtonText}
                    </Button>
                )}
            </React.Fragment>
        );
    }
}
