import React from 'react';
import { I18n } from 'react-redux-i18n';
import Button from '@material-ui/core/Button';
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
        logger.warn( 'ApplicationOverview: clicked download ', application.name );
        downloadAndInstallApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.warn( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, unInstallApp } = this.props;
        logger.warn( 'ApplicationOverview: clicked uninstall', application );
        unInstallApp( application );
    };

    handleCancelDownload = () => {
        const { application, cancelDownload } = this.props;
        logger.warn( 'ApplicationOverview: clicked cancel', application );
        cancelDownload( application );
    };

    handleResumeDownload = () => {
        const { application, resumeDownload } = this.props;
        logger.warn(
            'ApplicationOverview: clicked resume download',
            application
        );
        resumeDownload( application );
    };

    handlePauseDownload = () => {
        const { application, pauseDownload } = this.props;
        logger.silly(
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
            installFailed
        } = application;

        let buttonText = isInstalled
            ? I18n.t( `buttons.open` )
            : I18n.t( `buttons.install` );
        let secondButtonText = I18n.t( `buttons.cancelInstall` );
        let showSecondButton =
            isDownloadingAndInstalling || isDownloadingAndUpdating;

        let handleClick = isInstalled ? this.handleOpen : this.handleDownload;
        let handleSecondButtonClick = () => {}; // otherwise nothing

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelInstall` );

            handleClick = this.handlePauseDownload;
            handleSecondButtonClick = this.handleCancelDownload;
        }

        if ( isDownloadingAndUpdating ) {
            buttonText = I18n.t( `buttons.pause` );
            secondButtonText = I18n.t( `buttons.cancelUpdate` );

            handleClick = this.handlePauseDownload;
            handleSecondButtonClick = this.handleCancelDownload;
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

        return (
            <React.Fragment>
                <Button
                    onClick={handleClick}
                    aria-label="Application Action Button"
                >
                    {buttonText}
                </Button>
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
