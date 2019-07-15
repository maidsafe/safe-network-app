import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles( {
    root: {
        width: '100%',
        height: '100%',
        backgroundImage: `url(${'assets/images/on_boarding_popup_bg.png'})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    container: {
        padding: '0 24px',
        textAlign: 'center'
    },
    labelTitle: {
        marginBottom: '16px'
    }
} );

export const Intro = () => {
    const classes = useStyles();
    return (
        <Paper elevation={0} className={classes.root}>
            <Box className={classes.container}>
                <Typography variant="h5" className={classes.labelTitle}>
                    One Place for All SAFE Apps
                </Typography>
                <Typography>
                    A one-stop shop to access all SAFE Apps and manage instant
                    app updates.
                </Typography>
            </Box>
        </Paper>
    );
};
