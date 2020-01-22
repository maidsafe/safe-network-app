import React, { Component } from 'react';
import {
    Grid,
    CircularProgress,
    Typography,
    TextField,
    withStyles
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Fab from '@material-ui/core/Fab';
import LockIcon from '@material-ui/icons/Lock';
import { Redirect } from 'react-router-dom';

import styles from './Account.css';

import { Page } from '$Components/Page';
import { CustomTextField } from '$Components/StyledMui';
import { logger } from '$Logger';
import { HOME } from '$Constants/routes.json';


interface Props {
    loginError: string;
    logInToNetwork: Function;
    setAuthdWorking: Function;
    isLoggedIn: boolean;
    isWorking: boolean;
}

export const LoginPage = ( props: Props ) => {
    const { loginError, isLoggedIn, isWorking } = props;

    if ( isLoggedIn ) return <Redirect to={HOME} />;

    const [values, setValues] = React.useState( {
        passphrase: '',
        password: ''
        // stayLoggedIn: false
    } );

    // const [state, setState] = React.useState( {
    //     loginSwitch: true
    // } );

    // eslint-disable-next-line  unicorn/consistent-function-scoping
    // const handleChangeSwitch = ( name ) => ( event ) => {
    //     setState( { ...state, [name]: event.target.checked } );
    // };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    // until used ignore
    const handleLogin = () => {
        const { logInToNetwork, setAuthdWorking } = props;

        setAuthdWorking();
        logInToNetwork( values.password, values.passphrase );
    };

    // until used ignore
    // eslint-disable-next-line  unicorn/consistent-function-scoping
    // const handleStayLoggedIn = () => {
    //     // history.goBack();
    //     logger.info( 'clicked stay logged in' );
    // };

    return (
        <Page>
            <Grid item>
                <CustomTextField
                    aria-label="Password Field"
                    id="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange( 'password' )}
                />
            </Grid>
            <Grid item>
                <CustomTextField
                    aria-label="Passphrase Field"
                    id="passphrase"
                    label="Passphrase"
                    type="password"
                    value={values.passphrase}
                    onChange={handleChange( 'passphrase' )}
                />
            </Grid>
            {loginError && (
                <Grid item>
                    <Typography
                        variant="body2"
                        color="error"
                        aria-label="Login Error"
                    >
                        {loginError}
                    </Typography>
                </Grid>
            )}
            <Grid container justify="flex-end" spacing={2}>
                <Grid item>
                    <Fab
                        variant="extended"
                        size="large"
                        onClick={handleLogin}
                        aria-label="Login Button"
                        color="primary"
                    >
                        <LockIcon />
                        {isWorking ? 'Logging In' : 'Log In'}
                    </Fab>
                </Grid>
                {isWorking && (
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                )}
            </Grid>
            {
                // <Grid item style={{ display: 'inline-flex' }}>
                // <Typography
                // style={{ lineHeight: `2.5`, justifyContent: 'flex-start' }}
                // >
                // Keep me logged in
                // </Typography>
                // <Switch
                // checked={state.loginSwitch}
                // onChange={handleChangeSwitch( 'loginSwitch' )}
                // disabled
                // value="loginSwitch"
                // inputProps={{ 'aria-label': 'secondary checkbox' }}
                // style={{ justifyContent: 'flex-end' }}
                // />
                // </Grid>
            }
        </Page>
    );
};
