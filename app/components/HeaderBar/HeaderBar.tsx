import React from 'react';
import { Link, Route } from 'react-router-dom';
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
    ACCOUNT_CREATE
} from '$Constants/routes.json';

import appLogo from '$Assets/images/app_logo_white.svg';

import styles from './HeaderBar.css';

const BackButton = ( { location } ) => {
    return (
        <>
            {location.pathname !== '/' && (
                <Link to="/">
                    <IconButton
                        className={styles.BackButton}
                        style={{ fontSize: 18 }}
                        edge="start"
                        color="inherit"
                        aria-label="Go Backwards"
                    >
                        <ArrowBack style={{ fontSize: 18 }} />
                    </IconButton>
                </Link>
            )}
        </>
    );
};

const AppLogo = () => {
    return (
        <Box className={styles.appLogo}>
            <img src={appLogo} alt="App logo" />
        </Box>
    );
};

const MeatballMenu = ( props ) => {
    return (
        <React.Fragment>
            <IconButton
                onClick={props.handleClick}
                style={{ fontSize: 18 }}
                color="inherit"
            >
                <MoreVert fontSize="inherit" />
            </IconButton>
            <Menu
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                anchorEl={props.menuAnchorElement}
                keepMounted
                onClose={props.handleClose}
                open={Boolean( props.menuAnchorElement )}
            >
                <Link to={ACCOUNT_LOGIN}>
                    <MenuItem onClick={props.handleClose}>Login</MenuItem>
                </Link>
                <Link to={ACCOUNT_CREATE}>
                    <MenuItem onClick={props.handleClose}>
                        Create Account
                    </MenuItem>
                </Link>
                <Link to={SETTINGS}>
                    <MenuItem onClick={props.handleClose}>Settings</MenuItem>
                </Link>
            </Menu>
        </React.Fragment>
    );
};

export class HeaderBar extends React.PureComponent<Props> {
    constructor( props ) {
        super( props );
        this.state = { menuAnchorElement: null };
    }

    render() {
        const { pageTitle, shouldOnBoard, history } = this.props;

        console.log( history );
        const handleClick = ( event ) => {
            const previousState = this.state;
            this.setState( {
                ...previousState,
                menuAnchorElement: event.currentTarget
            } );
        };

        const handleClose = (): void => {
            const previousState = this.state;
            this.setState( { ...previousState, menuAnchorElement: null } );
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
                        <MeatballMenu
                            handleClick={handleClick}
                            handleClose={handleClose}
                            menuAnchorElement={this.state.menuAnchorElement}
                        />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
