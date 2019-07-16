import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    pinToTray: Function;
    autoLaunch: Function;
}

const Base = styled( Paper )( {
    paddingTop: '40px'
} );

const Container = styled( Box )( {
    padding: '0 16px 16px'
} );

const Title = styled( Typography )( {
    marginBottom: '24px'
} );

export const BasicSettings = ( props: Props ) => {
    const {
        userPreferences,
        setUserPreferences,
        pinToTray,
        autoLaunch
    } = props;

    const requiredItems = {
        autoUpdate: true,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: true
    };

    return (
        <Base elevation={0}>
            <Container>
                <Title variant="h5">Basic Settings</Title>
                <Typography>
                    Choose some basic settings. You can always change these
                    later.
                </Typography>
            </Container>
            <Box>
                <Preferences
                    userPreferences={userPreferences}
                    requiredItems={requiredItems}
                    onChange={setUserPreferences}
                    onChangeLaunchOnStart={autoLaunch}
                    onChangePinToMenu={pinToTray}
                />
            </Box>
        </Base>
    );
};
