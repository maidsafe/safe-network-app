import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { withRouter, Redirect } from 'react-router-dom';
import { Route, Switch, RouteComponentProps } from 'react-router';

import styles from './Account.css';

import { logger } from '$Logger';
import { CustomTextField } from '$Components/StyledMui';
import { Page } from '$Components/Page';
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
        <React.Fragment>
            <Typography variant="body2">Step 1 of 3</Typography>
            <Typography variant="h5">Enter Invite</Typography>
            <Typography variant="body2">
                Paste the link to get started.
            </Typography>
            <CustomTextField
                id="invite"
                aria-label="Redeem Invite Field"
                label="Invite"
                // className={classes.textField}
                value={values.invite}
                onChange={handleChange( 'invite' )}
                variant="outlined"
            />
            <Grid
                container
                justify="flex-end"
                alignContent="flex-end"
                spacing={2}
            >
                <Grid item>
                    <Button
                        color="primary"
                        onClick={handleLinkClick}
                        // className={ styles.formsButtonBack }
                    >
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleSaveInvite}
                        aria-label="Redeem Invite"
                        color="primary"
                        variant="contained"
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
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
        <React.Fragment>
            <Typography variant="body2">Step 1 of 2</Typography>
            <Typography variant="h5">Choose a Password</Typography>
            <Typography variant="body2">
                Make sure you keep it safe because it can’t be reset or
                recovered.
            </Typography>
            <CustomTextField
                aria-label="Create Password Field"
                id="password"
                type="password"
                label="Password"
                value={values.password}
                onChange={handleChange( 'password' )}
                variant="outlined"
            />
            <Grid
                container
                justify="flex-end"
                alignContent="flex-end"
                spacing={2}
            >
                <Grid item>
                    <Button
                        onClick={handleLinkClick}
                        // className={ styles.formsButtonBack }
                    >
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        aria-label="Save Password"
                        onClick={handleSavePassword}
                    >
                        Save Password
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
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
        <React.Fragment>
            <Typography variant="body2">Step 2 of 2</Typography>
            <Typography variant="h5">Choose a Passphrase</Typography>
            <Typography variant="body2">
                Make sure you keep it safe because it can’t be reset or
                recovered.
            </Typography>
            <CustomTextField
                id="passphrase"
                label="Passphrase"
                aria-label="Create Passphrase Field"
                value={values.passphrase}
                onChange={handleChange( 'passphrase' )}
                variant="outlined"
                type="password"
            />
            {createAccountError && (
                <Grid item>
                    <Typography
                        variant="body2"
                        color="error"
                        aria-label="Login Error"
                    >
                        {createAccountError}
                    </Typography>
                </Grid>
            )}
            <Grid
                container
                justify="flex-end"
                alignContent="flex-end"
                spacing={2}
            >
                <Grid item>
                    <Button
                        color="primary"
                        onClick={handleLinkClick}
                        // className={ styles.formsButtonBack }
                    >
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        aria-label="Save Passphrase"
                        onClick={handleSavePassphrase}
                        color="primary"
                        variant="contained"
                    >
                        Save Passphrase & Create Account
                    </Button>
                </Grid>
                {isWorking && (
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                )}
            </Grid>
        </React.Fragment>
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
        <Page>
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
        </Page>
    );
};
