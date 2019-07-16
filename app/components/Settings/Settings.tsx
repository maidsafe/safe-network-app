import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Preferences } from '$Components/Preferences';
import { UserPreferences } from '$Definitions/application.d';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    getUserPreferences: Function;
    storeUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
    history?: History;
}

export class Settings extends Component<Props> {
    componentWillMount() {
        this.props.getUserPreferences();
    }

    handleBack = () => {
        // go home
        this.props.history.push( '/' );
    };

    handlePreferenceChange = ( userPreferences: UserPreferences ) => {
        const { storeUserPreferences, setUserPreferences } = this.props;
        storeUserPreferences( userPreferences );
        setUserPreferences( userPreferences );
    };

    render() {
        const { userPreferences, pinToTray, autoLaunch } = this.props;

        return (
            <Grid container>
                <Box>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="GoBack"
                            onClick={this.handleBack}
                        >
                            <ArrowBack fontSize="inherit" />
                        </IconButton>
                        <Typography aria-label="title">Settings</Typography>
                    </Toolbar>
                </Box>
                <Grid item xs={12}>
                    <Preferences
                        userPreferences={userPreferences}
                        onChange={this.handlePreferenceChange}
                        onChangeLaunchOnStart={autoLaunch}
                        onChangePinToMenu={pinToTray}
                    />
                </Grid>
            </Grid>
        );
    }
}
