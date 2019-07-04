import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
    storeUserPreferences: Function;
}

export class BasicSettings extends Component<Props> {
    componentWillUnmount() {
        const {
            userPreferences,
            storeUserPreferences,
            autoLaunch,
            pinToTray
        } = this.props;

        // Enable auto launch if set
        if ( userPreferences.launchOnStart ) {
            autoLaunch( true );
        }

        // switch between standard or tray window
        pinToTray( userPreferences.pinToMenuBar );

        // Save user preference
        storeUserPreferences( userPreferences );
    }

    render() {
        const {
            userPreferences,
            setUserPreferences,
            pinToTray,
            autoLaunch
        } = this.props;

        const requiredItems = {
            autoUpdate: true,
            pinToMenuBar: true,
            launchOnStart: true,
            showDeveloperApps: true
        };
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h5">
                        Basic Settings
                    </Typography>
                    <Typography>
                        Choose some basic settings. You can always change these
                        later.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Preferences
                        userPreferences={userPreferences}
                        requiredItems={requiredItems}
                        onChange={setUserPreferences}
                        onChangeLaunchOnStart={autoLaunch}
                        onChangePinToMenu={pinToTray}
                    />
                </Grid>
            </Grid>
        );
    }
}
