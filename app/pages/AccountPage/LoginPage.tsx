import React, { Component } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

import { withRouter } from 'react-router-dom';

import { logger } from '$Logger';
import styles from './Account.css';

import { ACCOUNT_CREATE } from '$Constants/routes.json';

interface Props {
    history?: History;
    password: string;
    passphrase: string;
}

export const LoginPage = ( props: Props ) => {
    // const {
    //     // triggerSetAsTrayWindow,
    //     // isTrayWindow,
    //     // appPreferences
    // } = this.props;

    const { passphrase, password, history } = props;

    const [values, setValues] = React.useState( {
        passphrase: '',
        password: '',
        stayLoggedIn: false
    } );

    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    const handleLogin = () => {
        logger.info( 'Save the passssssshrase' );
        // history.push(ACCOUNT_CREATE_PASSPHRASE);
        // history.push(ACCOUNT_CREATE_PASSPHRASE);
    };
    const handleStayLoggedIn = () => {
        // history.goBack();
        logger.info( 'clicked stay logged in' );
    };
    return (
        <React.Fragment>
            <Typography variant="h4">Log In....</Typography>

            <TextField
                id="password"
                label="Password"
                // className={classes.textField}
                value={values.password}
                onChange={handleChange( 'password' )}
                margin="normal"
                variant="outlined"
            />
            <TextField
                id="passphrase"
                label="Passphrase"
                // className={classes.textField}
                value={values.passphrase}
                onChange={handleChange( 'passphrase' )}
                margin="normal"
                variant="outlined"
            />

            <Button onClick={handleLogin}>Login</Button>

            <FormControl component="fieldset">
                <FormGroup>
                    <FormControlLabel
                        labelPlacement="end"
                        control={
                            <Switch
                                checked={values.stayLoggedIn}
                                onChange={handleChange( 'stayLoggedIn' )}
                                value="checked"
                            />
                        }
                        label="Keep me logged in"
                    />
                </FormGroup>
            </FormControl>
        </React.Fragment>
    );
};
