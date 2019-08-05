import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Settings from '@material-ui/icons/Settings';
import Star from '@material-ui/icons/Star';
import { I18n } from 'react-redux-i18n';
import { SETTINGS, ON_BOARDING } from '$Constants/routes.json';

import styles from './HeaderBar.css';

interface Props {
    children: React.ReactChild;
    notifications: object;
    notificationCheckBox: boolean;
    acceptNotification: any;
    denyNotification: any;
    pushNotification: any;
    notificationToggleCheckBox: any;
    currentPath: string;
}

const BackButton = ( { location } ) => {
    return (
        <React.Fragment>
            {location.pathname !== '/' && (
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="Go Backwards"
                >
                    <Link to="/">
                        <ArrowBack fontSize="inherit" />
                    </Link>
                </IconButton>
            )}
        </React.Fragment>
    );
};

export class HeaderBar extends React.PureComponent<Props> {
    render() {
        const { currentPath } = this.props;
        // path always starts with a slash
        const targetTitle = currentPath.split( '/' )[1];
        const title = I18n.t( `pages.${targetTitle}` );

        return (
            <div className={styles.headerBar}>
                <Box>
                    <Toolbar>
                        {
                            // This regex route matches everywhere, but `/` home
                        }
                        <Route path="/" component={BackButton} />
                        <Typography aria-label="title" variant="h5">
                            {title}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="Go to onboarding"
                        >
                            <Link to={ON_BOARDING}>
                                <Star fontSize="inherit" />
                            </Link>
                        </IconButton>

                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="Go to settings"
                        >
                            <Link to={SETTINGS}>
                                <Settings fontSize="inherit" />
                            </Link>
                        </IconButton>
                    </Toolbar>
                </Box>
            </div>
        );
    }
}
