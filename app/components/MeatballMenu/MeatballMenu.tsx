import React, { Component } from 'react';
import { Button, Menu } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { MenuItems } from '$Components/MeatballMenu/MenuItems/MenuItems';
import { logger } from '$Logger';

import styles from '$Components/MeatballMenu/MeatballMenu.css';
import { App } from '$Definitions/application.d';

interface MeatballMenuProps {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

interface MeatballMenuState {
    anchorElement: HTMLElement;
}

export class MeatballMenu extends Component<
    MeatballMenuProps,
    MeatballMenuState
> {
    constructor( props ) {
        super( props );
        this.state = { anchorElement: null };
    }

    handleClick = ( event ) => {
        const previousState = this.state;
        this.setState( { ...previousState, anchorElement: event.currentTarget } );
    };

    handleClose = (): void => {
        const previousState = this.state;
        this.setState( { ...previousState, anchorElement: null } );
    };

    render() {
        const { anchorElement } = this.state;

        return (
            <div>
                <MoreVert onClick={this.handleClick} />
                <Menu
                    anchorEl={anchorElement}
                    keepMounted
                    onClose={this.handleClose}
                    open={Boolean( anchorElement )}
                >
                    <MenuItems {...this.props} handleClose={this.handleClose} />
                </Menu>
            </div>
        );
    }
}
