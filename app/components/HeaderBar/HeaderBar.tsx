import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import _ from 'lodash';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Star from '@material-ui/icons/Star';
import { SETTINGS, ON_BOARDING } from '$Constants/routes.json';

import appLogo from '$Assets/images/app_logo.svg';

import styles from './HeaderBar.css';

interface Props {
    pageTitle: string;
    shouldOnBoard: boolean;
    secondaryAction?: any;
}

const BackButton = ( { location } ) => {
    return (
        <>
            {location.pathname !== '/' && (
                <Link to="/">
                    <IconButton
                        className={styles.BackButton}
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
export class HeaderBar extends React.PureComponent<Props> {
    render() {
        const { pageTitle, shouldOnBoard, secondaryAction = null } = this.props;

        if ( shouldOnBoard ) return <div />;

        return (
            <Box className={styles.base}>
                <Toolbar className={styles.wrap} disableGutters>
                    {
                        // This regex route matches everywhere, but `/` home
                    }
                    <Box className={styles.navigation}>
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
                    </Box>
                    <Box>{secondaryAction}</Box>
                </Toolbar>
            </Box>
        );
    }
}
