import React from 'react';
import { I18n } from 'react-redux-i18n';
import Button from '@material-ui/core/Button';
import { logger } from '$Logger';
import { App } from '$Definitions/application.d';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

export class AppStateButton extends React.Component<Props> {
    handleDownload = () => {
        const { application, installApp } = this.props;
        logger.silly(
            'ApplicationOverview: clicked download ',
            application.name
        );
        installApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, uninstallApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked uninstall', application );
        uninstallApp( application );
    };

    handleClick = () => {
        const { application } = this.props;
        logger.silly( 'Choosing appropriate app action...' );

        const {
            isDownloadingAndInstalling,
            isInstalled,
            isOpen, // ?
            isUpdating, // does this entail installing?
            isUninstalling,
            hasUpdate,
            installFailed
        } = application;

        if ( !isInstalled ) this.handleDownload();

        if ( isInstalled ) this.handleOpen();
    };

    render() {
        const { application } = this.props;

        const {
            isDownloadingAndInstalling,
            isInstalled,
            isOpen, // ?
            isUpdating, // does this entail installing?
            isUninstalling,
            hasUpdate,
            installFailed
        } = application;

        let buttonText = isInstalled
            ? I18n.t( `buttons.open` )
            : I18n.t( `buttons.install` );

        if ( isDownloadingAndInstalling ) {
            buttonText = I18n.t( `buttons.cancelInstall` );
        }

        if ( isUpdating ) {
            buttonText = I18n.t( `buttons.cancelUpdate` );
        }

        if ( isUninstalling ) {
            buttonText = I18n.t( `buttons.uninstalling` );
        }

        return (
            <Button
                onClick={this.handleClick}
                aria-label="Application Action Button"
            >
                {buttonText}
            </Button>
        );
    }
}
