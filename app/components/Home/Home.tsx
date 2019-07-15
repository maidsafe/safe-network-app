import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import Star from '@material-ui/icons/Star';

import { SETTINGS, ON_BOARDING } from '$Constants/routes.json';

interface Props {
    getUserPreferences: Function;
    checkShouldOnboard: Function;
    history: History;
}

export class Home extends Component<Props> {
    componentWillMount() {
        this.props.checkShouldOnboard();
    }

    componentDidUpdate( props ) {
        const { launchpad, history } = this.props;
        if ( launchpad.shouldOnboard ) {
            history.push( ON_BOARDING );
        }
    }

    render() {
        const { history } = this.props;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Box>
                        <Toolbar>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="Settings"
                                onClick={() => {
                                    history.push( SETTINGS );
                                }}
                            >
                                <Settings fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="OnBoarding"
                                onClick={() => {
                                    history.push( ON_BOARDING );
                                }}
                            >
                                <Star fontSize="inherit" />
                            </IconButton>
                        </Toolbar>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}
