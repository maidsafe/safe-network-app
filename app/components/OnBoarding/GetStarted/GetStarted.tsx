import React from 'react';
import deepOrange from '@material-ui/core/colors/deepOrange';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { makeStyles, styled } from '@material-ui/core/styles';

import Logo from '$App/assets/images/logo.svg';

const useStyles = makeStyles( {
    root: {
        width: '100%',
        height: '100%',
        minHeight: '500px',
        background:
            'linear-gradient(156.98deg, #FA541C -164.31%, #454545 101.04%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    logo: {
        display: 'flex',
        width: '80px',
        height: '80px',
        backgroundColor: '#FA541C',
        borderRadius: '50%',
        justifyContent: 'center',
        boxShadow:
            '0px 0px 100px #FA541C, 0px 0px 50px #FA541C, 0px 0px 23px rgba(0, 0, 0, 0.25)'
    },
    context: {
        textAlign: 'center',
        marginTop: '60px',
        color: '#fff',
        padding: '0 40px'
    },
    labelTitle: {
        marginBottom: '20px'
    }
} );

const CustomButton = styled( Fab )( {
    textTransform: 'uppercase',
    // height: '36px',
    marginTop: '30px',
    backgroundColor: deepOrange[500],
    color: '#fff'
} );

interface Props {
    onClickGetStarted: Function;
}

export const GetStarted = ( props: Props ) => {
    const { onClickGetStarted } = props;
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <Paper className={classes.logo}>
                <img src={Logo} alt="Launchpad logo" />
            </Paper>
            <Box className={classes.context}>
                <Typography variant="h5" className={classes.labelTitle}>
                    SAFE Launchpad
                </Typography>
                <Typography>
                    All the apps you need to try the SAFE Network
                </Typography>
                <CustomButton
                    variant="extended"
                    size="medium"
                    onClick={() => {
                        onClickGetStarted();
                    }}
                >
                    Get Started
                </CustomButton>
            </Box>
        </Box>
    );
};
