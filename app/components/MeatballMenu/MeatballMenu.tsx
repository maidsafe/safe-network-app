import React, { Component } from 'react';
import { Button, Menu, IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { MenuItems } from '$Components/MeatballMenu/MenuItems/MenuItems';
import { logger } from '$Logger';

import styles from './MeatballMenu.css';
import { App } from '$Definitions/application.d';

interface MeatballMenuProps {
    showAboutAppOption?: boolean;
    unInstallApp: Function;
    openApp: Function;
    downloadAndInstallApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    application: App;
    updateApp: Function;
}

interface MeatballMenuState {
    menuAnchorElement: HTMLElement;
}

export class MeatballMenu extends Component<
MeatballMenuProps,
MeatballMenuState
> {
    constructor( props ) {
        super( props );
        this.state = { menuAnchorElement: null };
    }

    handleClick = ( event ) => {
        const previousState = this.state;
        this.setState( {
            ...previousState,
            menuAnchorElement: event.currentTarget
        } );
    };

    handleClose = (): void => {
        const previousState = this.state;
        this.setState( { ...previousState, menuAnchorElement: null } );
    };

    render() {
        const { menuAnchorElement } = this.state;

        return (
            <>
                <IconButton
                    className={styles.vertIcon}
                    onClick={this.handleClick}
                    style={{ fontSize: 18 }}
                >
                    <MoreVert fontSize="inherit" />
                </IconButton>
                <Menu
                    className={styles.Menu}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    anchorEl={menuAnchorElement}
                    keepMounted
                    onClose={this.handleClose}
                    open={Boolean( menuAnchorElement )}
                >
                    <MenuItems
                        unInstallApp={this.props.unInstallApp}
                        openApp={this.props.openApp}
                        showAboutAppOption={this.props.showAboutAppOption}
                        downloadAndInstallApp={this.props.downloadAndInstallApp}
                        pauseDownload={this.props.pauseDownload}
                        cancelDownload={this.props.cancelDownload}
                        resumeDownload={this.props.resumeDownload}
                        updateApp={this.props.updateApp}
                        application={this.props.application}
                        handleClose={this.handleClose}
                    />
                </Menu>
            </>
        );
    }
}
