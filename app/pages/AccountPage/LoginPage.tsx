import React, { Component } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

import { Redirect } from 'react-router-dom';

import { logger } from '$Logger';
import styles from './Account.css';

import { HOME, ACCOUNT_CREATE } from '$Constants/routes.json';

interface Props {
    loginError: string;
    logInToNetwork: Function;
    isLoggedIn: boolean;
}

export const LoginPage = ( props: Props ) => {
    const { loginError, isLoggedIn } = props;

    if ( isLoggedIn ) return <Redirect to={HOME} />;

    const [values, setValues] = React.useState( {
        passphrase: '',
        password: ''
        // stayLoggedIn: false
    } );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    // until used ignore
    const handleLogin = () => {
        const { logInToNetwork } = props;

        logInToNetwork( values.password, values.passphrase );
    };

    // until used ignore
    // eslint-disable-next-line unicorn/consistent-function-scoping
    // const handleStayLoggedIn = () => {
    //     // history.goBack();
    //     logger.info( 'clicked stay logged in' );
    // };

    return (
        <>
            <Typography variant="h4">Log In....</Typography>
            {loginError && (
                <Typography variant="h5" aria-label="Login Error">
                    {loginError}
                </Typography>
            )}
            <TextField
                aria-label="Password Field"
                id="password"
                label="Password"
                // className={classes.textField}
                value={values.password}
                onChange={handleChange( 'password' )}
                margin="normal"
                variant="outlined"
            />
            <TextField
                aria-label="Passphrase Field"
                id="passphrase"
                label="Passphrase"
                // className={classes.textField}
                value={values.passphrase}
                onChange={handleChange( 'passphrase' )}
                margin="normal"
                variant="outlined"
            />

            <Button onClick={handleLogin} aria-label="Login Button">
                Login
            </Button>

            {
                // <FormControl component="fieldset">
                //     <FormGroup>
                //         <FormControlLabel
                //             labelPlacement="end"
                //             control={
                //                 <Switch
                //                     checked={values.stayLoggedIn}
                //                     onChange={handleChange( 'stayLoggedIn' )}
                //                     value="checked"
                //                     aria-label="Keep me logged in"
                //                 />
                //             }
                //             label="Keep me logged in"
                //         />
                //     </FormGroup>
                // </FormControl>
            }
        </>
    );
};
