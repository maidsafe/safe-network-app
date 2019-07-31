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
                2,
                { text: 'Uninstall', onClick: this.handleUninstall },
                { text: 'Check for updates', onClick: this.handleDownload }
            );
        }

        if ( isDownloading ) {
            menuItemList.splice(
                1,
                2,
                { text: 'Cancel Install', onClick: () => {} },
                { text: 'Pause Download', onClick: () => {} }
            );
        } else if ( isInstalling ) {
            menuItemList.splice( 1, 1, {
                text: 'Cancel Install',
                onClick: () => {}
            } );
        } else if ( installFailed ) {
            menuItemList.splice(
                1,
                2,
                { text: 'Cancel Install', onClick: () => {} },
                { text: 'Re-try install', onClick: () => {} }
            );
        } else if ( hasUpdate ) {
            menuItemList.splice(
                1,
                3,
                { text: 'Open', onClick: () => {} },
                { text: 'Skip this update', onClick: () => {} },
                { text: 'Uninstall', onClick: this.handleUninstall }
            );
        }
        return menuItemList;
    };

    render() {
        return (
            <React.Fragment>
                {this.generateMenuItems().map( ( item, index ) => {
                    const randomKey = Math.random().toString( 32 );
                    return (
                        <MenuItem
                            dense
                            key={randomKey}
                            id={styles['menu-item']}
                            onClick={() => item.onClick()}
                        >
                            {item.text}
                        </MenuItem>
                    );
                } )}
            </React.Fragment>
        );
    }
}
