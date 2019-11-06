import React, { Component } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';

import { withRouter, Redirect } from 'react-router-dom';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { logger } from '$Logger';
import styles from './Account.css';

import {
    HOME,
    ACCOUNT_CREATE_REDEEM,
    ACCOUNT_CREATE_PASSWORD,
    ACCOUNT_CREATE_PASSPHRASE
} from '$Constants/routes.json';

// Whatever you expect in 'this.props.match.params.*'
type PathParamsType = {};

type CreateAccountPageProps = RouteComponentProps<PathParamsType> & {
    values: {
        invite: string;
        password: string;
        passphrase: string;
    };
    history: {
        goBack: Function;
        push: Function;
    };
    handleChange: Function;
    createAccount?: Function;
    createAccountError?: string;
    isWorking?: boolean;
    setAuthdWorking?: Function;
};
interface CreateAccountProps {
    isLoggedIn: boolean;
    isWorking: boolean;
    setAuthdWorking: Function;
    createAccount: Function;
    createAccountError: string;
}

const Invite = withRouter( ( props: CreateAccountPageProps ) => {
    // TODO: put info type anad back / next buttons.
    // On click next set password etc in store.

    const { history, handleChange, values } = props;

    const handleSaveInvite = () => {
        logger.info( 'Saved the invite' );
        history.push( ACCOUNT_CREATE_PASSWORD );
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <>
            <Typography variant="body2">Step 1 of 3</Typography>
            <Typography variant="h4">Enter Invite</Typography>
            <Typography variant="body2">
                Paste the link to get started.
            </Typography>
            <TextField
                id="invite"
                aria-label="Redeem Invite Field"
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
                <Button onClick={handleSaveInvite} aria-label="Redeem Invite">
                    Next
                </Button>
            </Grid>
        </>
    );
} );

const Password = withRouter( ( props: CreateAccountPageProps ) => {
    const { history, handleChange, values } = props;

    const handleSavePassword = () => {
        logger.info( 'Saved the password' );
        history.push( ACCOUNT_CREATE_PASSPHRASE );
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <>
            <Typography variant="body2">Step 2 of 3</Typography>
            <Typography variant="h4">Choose a Password</Typography>
            <Typography variant="body2">
                Make sure you keep it safe beacuse it can’t be reset or
                recovered.
            </Typography>
            <TextField
                aria-label="Create Password Field"
                id="password"
                label="Password"
                value={values.password}
                onChange={handleChange( 'password' )}
                margin="normal"
                variant="outlined"
            />
            <Grid container>
                <Typography>
                    <Button onClick={handleLinkClick}>Back</Button>
                </Typography>
                <Button aria-label="Save Password" onClick={handleSavePassword}>
                    Save Password
                </Button>
            </Grid>
        </>
    );
} );

const Passphrase = withRouter( ( props: CreateAccountPageProps ) => {
    const {
        history,
        handleChange,
        values,
        createAccount,
        createAccountError,
        isWorking,
        setAuthdWorking
    } = props;

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleSavePassphrase = () => {
        logger.info( 'Save the passhrase and create!!', values );
        setAuthdWorking();
        createAccount( values.invite, values.password, values.passphrase );
    };
    const handleLinkClick = () => {
        history.goBack();
    };

    return (
        <>
            <Typography variant="body2">Step 3 of 3</Typography>
            <Typography variant="h4">Choose a Passphrase</Typography>
            <Typography variant="body2">
                Make sure you keep it safe beacuse it can’t be reset or
                recovered.
            </Typography>
            <TextField
                id="passphrase"
                label="Passphrase"
                aria-label="Create Passphrase Field"
                value={values.passphrase}
                onChange={handleChange( 'passphrase' )}
                margin="normal"
                variant="outlined"
            />
            <Grid container>
                <Typography>
                    <Button onClick={handleLinkClick}>Back</Button>
                </Typography>
                <Button
                    aria-label="Save Passphrase"
                    onClick={handleSavePassphrase}
                >
                    Save Passphrase & Create Account
                </Button>
                {isWorking && (
                    <span aria-label="Working...">working on it...</span>
                )}
                {createAccountError && (
                    <Typography variant="h5">{createAccountError}</Typography>
                )}
            </Grid>
        </>
    );
} );

export const CreateAccountPage = ( props: CreateAccountProps ) => {
    const {
        createAccount,
        isLoggedIn,
        isWorking,
        createAccountError,
        setAuthdWorking
    } = props;
    const [values, setValues] = React.useState( {
        password: '',
        passphrase: '',
        invite: ''
    } );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleChange = ( name ) => ( event ) => {
        setValues( { ...values, [name]: event.target.value } );
    };

    if ( isLoggedIn ) return <Redirect to={HOME} />;

    return (
        <div>
            <Switch>
                <Route
                    path={ACCOUNT_CREATE_REDEEM}
                    render={() => (
                        <Invite handleChange={handleChange} values={values} />
                    )}
                />
                <Route
                    path={ACCOUNT_CREATE_PASSWORD}
                    render={() => (
                        <Password handleChange={handleChange} values={values} />
                    )}
                />
                <Route
                    path={ACCOUNT_CREATE_PASSPHRASE}
                    render={() => (
                        <Passphrase
                            handleChange={handleChange}
                            values={values}
                            isWorking={isWorking}
                            setAuthdWorking={setAuthdWorking}
                            createAccount={createAccount}
                            createAccountError={createAccountError}
                        />
                    )}
                />
            </Switch>
        </div>
    );
};
