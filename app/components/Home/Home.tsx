import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import Star from '@material-ui/icons/Star';
import { Overview } from '$Components/Overview';

import { SETTINGS, ON_BOARDING } from '$Constants/routes.json';
import { AppManagerState } from '$Definitions/application.d';

interface Props {
    getUserPreferences: Function;
    history: History;
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    appManagerState: AppManagerState;
    fetchApps: Function;
    triggerSetAsTrayWindow: Function;
    isTrayWindow: boolean;
}

export class Home extends Component<Props> {
    componentWillMount() {
        this.props.getUserPreferences();
    }

    render() {
        const { history } = this.props;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Overview key="grid__overview" {...this.props} />
                </Grid>
            </Grid>
        );
    }
}
