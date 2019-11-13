import React, { Component } from 'react';
import { Grid, Button, Typography, TextField, Fab } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import LockIcon from '@material-ui/icons/Lock';
import logger from '$Logger';

export const LoginPage = ( props: Props ) => {
    const { passphrase, password, history } = props;
    const [values, setValues] = React.useState( {
        passphrase: '',
        password: '',
        stayLoggedIn: false
    } );

    const [state, setState] = React.useState( {
        loginSwitch: true
    } );

    // eslint-disable-next-line  unicorn/consistent-function-scoping
    const handleChangeSwitch = ( name ) => ( event ) => {
        setState( { ...state, [name]: event.target.checked } );
    };

    // eslint-disable-next-line  unicorn/consistent-function-scoping
    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    // until used ignore
    // eslint-disable-next-line  unicorn/consistent-function-scoping
    const handleLogin = () => {
        logger.info( 'Save the passssssshrase' );
        // history.push(ACCOUNT_CREATE_PASSPHRASE);
    };

    // until used ignore
    // eslint-disable-next-line  unicorn/consistent-function-scoping
    const handleStayLoggedIn = () => {
        // history.goBack();
        logger.info( 'clicked stay logged in' );
    };

    return (
        <Grid container direction="column">
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
                    aria-label="Login-button"
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
            <Grid item style={{ display: 'inline-flex' }}>
                <Typography
                    style={{ lineHeight: `2.5`, justifyContent: 'flex-start' }}
                >
                    Keep me logged in
                </Typography>
                <Switch
                    checked={state.loginSwitch}
                    onChange={handleChangeSwitch( 'loginSwitch' )}
                    value="loginSwitch"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    style={{ justifyContent: 'flex-end' }}
                />
            </Grid>
        </Grid>
    );
};
