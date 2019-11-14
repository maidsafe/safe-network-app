import React, { Component } from 'react';
import { Grid, Button, Typography, TextField, Fab } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import LockIcon from '@material-ui/icons/Lock';
import { Redirect } from 'react-router-dom';

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
        <Grid container direction="column">
            {loginError && (
                <Typography variant="h5" aria-label="Login Error">
                    {loginError}
                </Typography>
            )}
            {isWorking && <span>Logging in....</span>}
            <Grid item style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <TextField
                    aria-label="Password Field"
                    id="password"
                    label="Password"
                    style={{ minWidth: `365px` }}
                    // className={classes.textField}
                    value={values.password}
                    onChange={handleChange( 'password' )}
                    margin="normal"
                    variant="outlined"
                />
            </Grid>
            <Grid item style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <TextField
                    aria-label="Passphrase Field"
                    id="passphrase"
                    label="Passphrase"
                    style={{ minWidth: `365px` }}
                    // className={classes.textField}
                    value={values.passphrase}
                    onChange={handleChange( 'passphrase' )}
                    margin="normal"
                    variant="outlined"
                />
            </Grid>
            <Grid item style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Fab
                    variant="extended"
                    size="small"
                    onClick={handleLogin}
                    aria-label="Login Button"
                    style={{
                        minWidth: `365px`,
                        minHeight: `48px`,
                        borderRadius: `50px`,
                        justifyContent: `initial`,
                        backgroundColor: `#4054B2`
                    }}
                >
                    <LockIcon
                        style={{
                            fontSize: `21px`,
                            marginLeft: `5px`,
                            color: `white`
                        }}
                    />
                    <Typography
                        variant="button"
                        style={{
                            marginRight: `auto`,
                            marginLeft: `auto`,
                            color: `white`
                        }}
                    >
                        LOG IN
                    </Typography>
                </Fab>
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
        </Grid>
    );
};
