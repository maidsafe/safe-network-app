import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { MoreVert } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';

import {
    SETTINGS,
    ACCOUNT_LOGIN,
    ACCOUNT_CREATE_PASSWORD
} from '$Constants/routes.json';

import appLogo from '$Assets/images/app_logo_white.svg';

import styles from './HeaderBar.css';

const BackButton = withRouter( ( { location, history } ) => {
    const handleClick = () => {
        history.goBack();
    };
    return (
        <>
            {location.pathname !== '/' && (
                <IconButton
                    className={styles.BackButton}
                    style={{ fontSize: 18 }}
                    onClick={handleClick}
                    edge="start"
                    color="inherit"
                    aria-label="Go Backwards"
                >
                    <ArrowBack style={{ fontSize: 18 }} />
                </IconButton>
            )}
        </>
    );
} );

const AppLogo = () => {
    return (
        <Box className={styles.appLogo}>
            <img src={appLogo} alt="App logo" />
        </Box>
    );
};

interface Props {
    pageTitle: string;
    shouldOnBoard: boolean;
    isLoggedIn: boolean;
    logOutOfNetwork: Function;
}

interface State {
    menuAnchorElement: null | Element;
}

export class HeaderBar extends React.PureComponent<Props, State> {
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
        const {
            pageTitle,
            logOutOfNetwork,
            isLoggedIn,
            shouldOnBoard
        } = this.props;

        const handleLogout = () => {
            logOutOfNetwork();
            this.handleClose();
        };

        if ( shouldOnBoard ) return <div />;

        return (
            <div className={styles.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Route path="/" component={BackButton} />
                        {pageTitle ? (
                            <Typography
                                className={styles.title}
                                aria-label="title"
                                variant="subtitle2"
                            >
                                {pageTitle}
                            </Typography>
                        ) : (
                            <AppLogo />
                        )}
                        <IconButton
                            onClick={this.handleClick}
                            style={{ fontSize: 18 }}
                            color="inherit"
                            aria-label="Header Menu"
                        >
                            <MoreVert fontSize="inherit" />
                        </IconButton>
                        <Menu
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            anchorEl={this.state.menuAnchorElement}
                            keepMounted
                            onClose={this.handleClose}
                            open={Boolean( this.state.menuAnchorElement )}
                        >
                            {!isLoggedIn && (
                                <Link to={ACCOUNT_LOGIN}>
                                    <MenuItem onClick={this.handleClose}>
                                        Log In
                                    </MenuItem>
                                </Link>
                            )}
                            {isLoggedIn && (
                                <MenuItem onClick={handleLogout}>
                                    Log Out
                                </MenuItem>
                            )}
                            <Link to={ACCOUNT_CREATE_PASSWORD}>
                                <MenuItem onClick={this.handleClose}>
                                    Create Account
                                </MenuItem>
                            </Link>
                            <Link to={SETTINGS}>
                                <MenuItem
                                    onClick={this.handleClose}
                                    aria-label="Go to Settings"
                                >
                                    Settings
                                </MenuItem>
                            </Link>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
