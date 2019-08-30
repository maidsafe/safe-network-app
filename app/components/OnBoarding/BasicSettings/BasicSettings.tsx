import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { I18n } from 'react-redux-i18n';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styles from './BasicSettings.css';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    isTrayWindow: boolean;
}

export const BasicSettings = ( properties ) => {
    const { userPreferences, setUserPreferences, isTrayWindow } = properties;
    const requiredItems = {
        autoUpdate: true,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: true
    };
    return (
        <Paper
            className={styles.Base}
            elevation={0}
            aria-label="BasicSettingsPage"
        >
            <Box className={styles.Container}>
                <Typography className={styles.Title} variant="h5">
                    {I18n.t( `onboarding.title.basic_settings` )}
                </Typography>
                <Typography>
                    {I18n.t( `onboarding.subTitle.basic_settings` )}
                </Typography>
            </Box>
            <Grid item xs={12}>
                <Preferences
                    isTrayWindow={isTrayWindow}
                    userPreferences={userPreferences}
                    requiredItems={requiredItems}
                    onChange={setUserPreferences}
                />
            </Grid>
        </Paper>
    );
};
