import React, { Component } from 'react';
import {
    Grid,
    Paper,
    Box,
    CssBaseline,
    Typography,
    Button,
    Divider
} from '@material-ui/core';

// Material-ui Icons
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import LockIcon from '@material-ui/icons/Lock';
import DiscFullIcon from '@material-ui/icons/DiscFull';
import LoopIcon from '@material-ui/icons/Loop';

interface Props {
    latestNotification: any;
    acceptNotification: any;
    denyNotification: any;
}

export class Notification extends React.PureComponent<Props> {
    render() {
        const {
            latestNotification,
            acceptNotification,
            denyNotification
        } = this.props;

        const components = {
            SignalWifiOffIcon,
            WarningIcon,
            InfoIcon,
            LockIcon,
            DiscFullIcon,
            LoopIcon
        };

        const handleOnAccept = () => {
            acceptNotification( latestNotification );
        };

        const handleOnDeny = () => {
            denyNotification( latestNotification  );
        };

        const TagName = components[latestNotification.icon || 'WarningIcon'];

        return (
            <React.Fragment>
                <CssBaseline />
                <Paper elevation={0}>
                    <Box pt={1} pr={1} pb={1} pl={1}>
                        <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item>
                                <Box aria-label="NotificationIcon">
                                    <TagName style={{ fontSize: 38 }} />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Typography aria-label="NotificationTitle">
                                    {latestNotification.title}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end" spacing={1}>
                            <Grid item>
                                <Button
                                    aria-label="AcceptNotification"
                                    color="primary"
                                    onClick={handleOnAccept}
                                >
                                    {latestNotification.acceptText}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    aria-label="DenyNotification"
                                    color="primary"
                                    onClick={handleOnDeny}
                                >
                                    {latestNotification.denyText}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Divider />
            </React.Fragment>
        );
    }
}
