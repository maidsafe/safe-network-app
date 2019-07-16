import React, { Component } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { logger } from '$Logger';

import styles from './MeatballMenu.css';
import { App } from '$Definitions/application.d';
import { shallowCompare } from '$Utils/app_utils';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

interface MenuItemObject {
    text: string;
    onClick: Function;
}

interface MeatballMenuState {
    anchorElement: HTMLElement;
    menuItemList: Array<MenuItemObject>;
}

export class MeatballMenu extends Component<Props, MeatballMenuState> {
    constructor( props ) {
        super( props );
        const menuItemList = [
            { text: 'About', onClick: () => this.handleClose() }
        ];
        this.state = { anchorElement: null, menuItemList };
    }

    componentDidMount() {
        const { application } = this.props;
        this.handleMeatballMenuUpdate( {}, this.state );
    }

    componentDidUpdate( previousProperties, previousState ) {
        const { application } = this.props;
        this.handleMeatballMenuUpdate(
            previousProperties.application,
            previousState
        );
    }

    handleDownload = () => {
        const { application, installApp } = this.props;
        logger.silly( 'clicked download', application );
        installApp( application );
        this.handleClose();
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.silly( 'clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, uninstallApp } = this.props;
        logger.silly( 'clicked uninstall', application );
        uninstallApp( application );
    };

    handleClick = ( event ) => {
        const previousState = this.state;
        this.setState( { ...previousState, anchorElement: event.currentTarget } );
    };

    handleClose = (): void => {
        const previousState = this.state;
        this.setState( { ...previousState, anchorElement: null } );
    };

    handleMeatballMenuUpdate = ( previousAppProperties, previousState ) => {
        const { application } = this.props;
        if ( !shallowCompare( application, previousAppProperties ) ) {
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
            const menuItemList = previousState.menuItemList.splice( 0, 1 );
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
            this.setState( { ...previousState, menuItemList } );
        }
    };

    render() {
        const { application } = this.props;
        const { anchorElement, menuItemList } = this.state;

        return (
            <div>
                <MoreVert onClick={this.handleClick} />
                <Menu
                    anchorEl={anchorElement}
                    keepMounted
                    onClose={this.handleClose}
                    open={Boolean( anchorElement )}
                >
                    {menuItemList.map( ( item, index ) => (
                        <MenuItem
                            key={`${application.packageName}__${index}`} // eslint-disable-line react/no-array-index-key
                            className={`${application.packageName}__${index}`}
                            onClick={() => item.onClick()}
                        >
                            {item.text}
                        </MenuItem>
                    ) )}
                </Menu>
            </div>
        );
    }
}
