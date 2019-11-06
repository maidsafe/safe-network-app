import React, { Component } from 'react';
import { History } from 'history';
import {
    Grid,
    ListItem,
    ListItemText,
    Box,
    Toolbar,
    Typography,
    IconButton
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Preferences } from '$Components/Preferences';
import styles from './Settings.css';

import {
    UserPreferences,
    AppPreferences,
    Preferences as PreferencesDef
} from '$Definitions/application.d';

interface Props {
    userPreferences: UserPreferences;
    appPreferences: AppPreferences;
    setUserPreferences: Function;
    getUserPreferences: Function;
    triggerSetAsTrayWindow: Function;
    autoLaunch: Function;
    quitApplication: Function;
    history?: History;
    isTrayWindow: boolean;
}

export class Settings extends Component<Props> {
    componentDidMount() {
        this.props.getUserPreferences();
    }

    handleBack = () => {
        // go home
        this.props.history.push( '/' );
    };

    handlePreferenceChange = ( userPreferences: UserPreferences ) => {
        this.props.setUserPreferences( userPreferences );
    };

    render() {
        const {
            userPreferences,
            setUserPreferences,
            triggerSetAsTrayWindow,
            autoLaunch,
            isTrayWindow,
            quitApplication
        } = this.props;

        return (
            <Grid item xs={12} className={styles.wrap}>
                <Preferences
                    isTrayWindow={isTrayWindow}
                    userPreferences={userPreferences}
                    onChange={this.handlePreferenceChange}
                    onChangeLaunchOnStart={autoLaunch}
                    onChangePinToMenu={triggerSetAsTrayWindow}
                >
                    {isTrayWindow && (
                        <ListItem
                            button
                            onClick={() => {
                                quitApplication();
                            }}
                        >
                            <ListItemText
                                primary="Quit"
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                            />
                        </ListItem>
                    )}
                </Preferences>
            </Grid>
        );
    }
}
