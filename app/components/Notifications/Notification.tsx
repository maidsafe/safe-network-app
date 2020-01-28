import React, { Component } from 'react';
import {
    Grid,
    Paper,
    Box,
    Avatar,
    Typography,
    Button,
    Divider
} from '@material-ui/core';
import { Banner } from 'material-ui-banner';
// Material-ui Icons
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import LockIcon from '@material-ui/icons/Lock';
import DiscFullIcon from '@material-ui/icons/DiscFull';
import LoopIcon from '@material-ui/icons/Loop';
import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar';

import styles from './Notification.css';

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
            SignalWifi4BarIcon,
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
            denyNotification( latestNotification );
        };

        const NotificationIcon =
            components[latestNotification.icon || 'WarningIcon'];

        return (
            <Box className={styles.Base}>
                <Paper elevation={0} className={styles.Container}>
                    <Grid container wrap="nowrap" alignItems="center">
                        <Grid item>
                            <Avatar
                                className={styles.Icon}
                                aria-label="NotificationIcon"
                            >
                                <NotificationIcon
                                    color="action"
                                    fontSize="inherit"
                                />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography
                                aria-label="NotificationTitle"
                                variant="body2"
                                className={styles.Title}
                            >
                                {latestNotification.title}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        justify="flex-end"
                        className={styles.Actions}
                    >
                        {latestNotification.acceptText && (
                            <Grid item>
                                <Button
                                    color="primary"
                                    aria-label="AcceptNotification"
                                    className={styles.ActionButton}
                                    onClick={handleOnAccept}
                                >
                                    {latestNotification.acceptText}
                                </Button>
                            </Grid>
                        )}
                        {latestNotification.denyText && (
                            <Grid item>
                                <Button
                                    className={styles.ActionButton}
                                    aria-label="DenyNotification"
                                    color="primary"
                                    onClick={handleOnDeny}
                                >
                                    {latestNotification.denyText}
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
                <Divider />
            </Box>
        );
    }
}
