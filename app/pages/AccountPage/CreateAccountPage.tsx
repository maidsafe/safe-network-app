import React, { Component } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';

import { logger } from '$Logger';
import styles from './Account.css';

import {
    ACCOUNT_CREATE_REDEEM,
    ACCOUNT_CREATE_PASSWORD,
    ACCOUNT_CREATE_PASSPHRASE
} from '$Constants/routes.json';

interface InviteProps {
    invite: string;
    history: {
        goBack: Function;
        push: Function;
    };
}
interface PasswordProps {
    password: string;
    history: {
        goBack: Function;
        push: Function;
    };
}
interface PassphraseProps {
    passphrase: string;
    history: { goBack: Function };
}
interface Props {
    unInstallApp: Function;
}

const Invite = withRouter( ( props: InviteProps ) => {
    // TODO: put info type anad back / next buttons.
    // On click next set password etc in store.

    const { password, history } = props;

    const [values, setValues] = React.useState( {
        invite: ''
    } );

    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    const handleSaveInvite = () => {
        logger.info( 'Save the invite' );
        history.push( ACCOUNT_CREATE_PASSWORD );
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <React.Fragment>
            <Typography variant="body2">Step 1 of 3</Typography>
            <Typography variant="h4">Enter Invite</Typography>
            <Typography variant="body2">
                Paste the link to get started.
            </Typography>
            <TextField
                id="invite"
                label="Invite"
                // className={classes.textField}
                value={values.invite}
                onChange={handleChange( 'invite' )}
                margin="normal"
                variant="outlined"
            />
            <Grid container>
                <Typography>
                    <Button onClick={handleLinkClick}>Back</Button>
                </Typography>
                <Button onClick={handleSaveInvite}>Next</Button>
            </Grid>
        </React.Fragment>
    );
} );

const Password = withRouter( ( props: PasswordProps ) => {
    const { password, history } = props;

    const [values, setValues] = React.useState( {
        password: ''
    } );

    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    const handleSavePassword = () => {
        logger.info( 'Save the passsssssword' );
        history.push( ACCOUNT_CREATE_PASSPHRASE );
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <React.Fragment>
            <Typography variant="body2">Step 2 of 3</Typography>
            <Typography variant="h4">Choose a Password</Typography>
            <Typography variant="body2">
                Make sure you keep it safe beacuse it can’t be reset or
                recovered.
            </Typography>
            <TextField
                id="password"
                label="Password"
                // className={classes.textField}
                value={values.password}
                onChange={handleChange( 'password' )}
                margin="normal"
                variant="outlined"
            />
            <Grid container>
                <Typography>
                    <Button onClick={handleLinkClick}>Back</Button>
                </Typography>
                <Button onClick={handleSavePassword}>Save Password</Button>
            </Grid>
        </React.Fragment>
    );
} );

const Passphrase = withRouter( ( props: PassphraseProps ) => {
    const { passphrase, history } = props;

    const [values, setValues] = React.useState( {
        passphrase: ''
    } );

    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    const handleSavePassphrase = () => {
        logger.info( 'Save the passssssshrase' );
        // history.push(ACCOUNT_CREATE_PASSPHRASE);
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <React.Fragment>
            <Typography variant="body2">Step 3 of 3</Typography>
            <Typography variant="h4">Choose a Passphrase</Typography>
            <Typography variant="body2">
                Make sure you keep it safe beacuse it can’t be reset or
                recovered.
            </Typography>
            <TextField
                id="passphrase"
                label="Passphrase"
                // className={classes.textField}
                value={values.passphrase}
                onChange={handleChange( 'passphrase' )}
                margin="normal"
                variant="outlined"
            />
            <Grid container>
                <Typography>
                    <Button onClick={handleLinkClick}>Back</Button>
                </Typography>
                <Button onClick={handleSavePassphrase}>Save Passphrase</Button>
            </Grid>
        </React.Fragment>
    );
} );
export const CreateAccountPage = ( props: Props ) => {
    // const {
    //     // triggerSetAsTrayWindow,
    //     // isTrayWindow,
    //     // appPreferences
    // } = this.props;

    return (
        <div>
            <Switch>
                <Route path={ACCOUNT_CREATE_REDEEM} component={Invite} />
                <Route path={ACCOUNT_CREATE_PASSWORD} component={Password} />
                <Route
                    path={ACCOUNT_CREATE_PASSPHRASE}
                    component={Passphrase}
                />
            </Switch>
        </div>
    );
};
