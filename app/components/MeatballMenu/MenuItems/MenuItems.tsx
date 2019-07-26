import React, { Component } from 'react';
import { MenuItem } from '@material-ui/core';
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
        logger.silly( 'MeatballMenu: clicked download ', application );
        installApp( application );
        handleClose();
    };

    handleOpen = () => {
        const { application, openApp, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked open ', application );
        openApp( application );
        handleClose();
    };

    handleUninstall = () => {
        const { application, uninstallApp, handleClose } = this.props;
        logger.silly( 'MeatballMenu: clicked uninstall: ', application );
        uninstallApp( application );
        handleClose();
    };

    generateMenuItems = () => {
        const { application } = this.props;
        const menuItemList = [{ text: 'About this App...', onClick: () => {} }];
        const {
            progress,
            isInstalling,
            isUninstalling,
            isUpdating,
            isDownloading,
            hasUpdate,
            isInstalled,
            installFailed
        } = application;
        if ( !isInstalled ) {
            menuItemList.splice( 1, 0, {
                text: 'Install',
                onClick: this.handleDownload
            } );
        } else {
            menuItemList.splice(
                1,
                0,
                { text: 'Uninstall', onClick: this.handleUninstall },
                { text: 'Check for updates', onClick: this.handleDownload }
            );
        }

        if ( isDownloading ) {
            menuItemList.splice(
                1,
                0,
                { text: 'Cancel Install', onClick: () => {} },
                { text: 'Pause Download', onClick: () => {} }
            );
        } else if ( isInstalling ) {
            menuItemList.splice( 1, 0, {
                text: 'Cancel Install',
                onClick: () => {}
            } );
        } else if ( installFailed ) {
            menuItemList.splice(
                1,
                0,
                { text: 'Cancel Install', onClick: () => {} },
                { text: 'Re-try install', onClick: () => {} }
            );
        } else if ( hasUpdate ) {
            menuItemList.splice(
                1,
                0,
                { text: 'Open', onClick: () => {} },
                { text: 'Skip this update', onClick: () => {} },
                { text: 'Uninstall', onClick: this.handleUninstall }
            );
        }

        return (
            <React.Fragment>
                {menuItemList.map( ( item, index ) => (
                    <MenuItem
                        dense
                        key={`${application.packageName}__${index}`} // eslint-disable-line react/no-array-index-key
                        className={`${styles['menu-item']} ${
                            application.packageName
                        }__menu-item__${index}`}
                        onClick={() => item.onClick()}
                    >
                        {item.text}
                    </MenuItem>
                ) )}
            </React.Fragment>
        );
    };

    render() {
        return this.generateMenuItems();
    }
}
