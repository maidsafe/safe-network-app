import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { notificationTypes } from '$Constants/notifications';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

// Material-ui Icons
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import LockIcon from '@material-ui/icons/Lock';
import DiscFullIcon from '@material-ui/icons/DiscFull';
import LoopIcon from '@material-ui/icons/Loop';

const useStyles = makeStyles( ( theme: any ) => ( {
    icon: {
        margin: theme.spacing( 1 ),
        fontSize: 32
    }
} ) );

export function Notification( properties ) {
    const classes = useStyles();

    const components = {
        SignalWifiOffIcon,
        WarningIcon,
        InfoIcon,
        LockIcon,
        DiscFullIcon,
        LoopIcon
    };

    const { notifications, dismissNotification } = properties;

    if ( notifications !== null && notifications !== undefined ) {
        const notificationKeys = Object.keys( notifications );
        const latestNotificationId: string =
            notificationKeys[notificationKeys.length - 1];
        const latestNotification = notifications[latestNotificationId];

        const TagName = components[latestNotification.icon || 'WarningIcon'];

        // Remove this
        /*
            const defaultProps = {
                acceptText: 'RESUME',
                denyText: 'DISMISS',
                message: 'Uhh Ohh Something Went Wrong!',
                icon: <InfoIcon />
            };

            latestNotification = { ...defaultProps, ...latestNotification };
        */

        const handleOnAccept = () => {
            if ( latestNotification.acceptAction ) {
                latestNotification.acceptAction();
            }
            // Pass the notification id to remove it from the list
            // dismissNotification({ id: latestNotification.id });
        };

        const handleOnDeny = () => {
            if ( latestNotification.denyAction ) {
                latestNotification.denyAction();
            }
            // Pass the notification id to remove it from the list
            // dismissNotification({ id: latestNotification.id });
            /*
                {
                    ComponentGenerator(latestNotification.icon)
                }
            */
            //
        };

        return (
            <div>
                <React.Fragment>
                    <CssBaseline />
                    <Paper elevation={0}>
                        <Box pt={2} pr={1} pb={1} pl={1}>
                            <Grid
                                container
                                // @ts-ignore
                                spacing={1}
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <Grid item>
                                    <TagName className={classes.icon} />
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        {latestNotification.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-end" spacing={0}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        onClick={handleOnAccept}
                                    >
                                        {latestNotification.denyText}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        onClick={handleOnDeny}
                                    >
                                        {latestNotification.acceptText}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                    <Divider />
                </React.Fragment>
            </div>
        );
    }
}
