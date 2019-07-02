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
    history?: History;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export class Settings extends Component<Props> {
    componentWillUnmount() {
        Preferences.changeCompleted( this.props.userPreferences );
    }

    render() {
        const { userPreferences, setUserPreferences, history } = this.props;
        return (
            <Grid container>
                <Box>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="GoBack"
                            onClick={() => {
                                history.push( '/' );
                            }}
                        >
                            <ArrowBack fontSize="inherit" />
                        </IconButton>
                        <Typography aria-label="title">Settings</Typography>
                    </Toolbar>
                </Box>
                <Grid item xs={12}>
                    <Preferences
                        userPreferences={userPreferences}
                        onChange={setUserPreferences}
                    />
                </Grid>
            </Grid>
        );
    }
}
