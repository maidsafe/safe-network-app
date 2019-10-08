import React, { Component } from 'react';
import { Grid, List, Typography } from '@material-ui/core';

import { Redirect, Route, Switch } from 'react-router';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { logger } from '$Logger';

import { AccountOverview } from '$Pages/AccountPage/AccountOverview';
import { AccountOnBoarding } from '$Pages/AccountPage/AccountOnBoarding';
import { CreateAccountPage } from '$Pages/AccountPage/CreateAccountPage';
import { LoginPage } from '$Pages/AccountPage/LoginPage';

import styles from './Account.css';

import {
    ACCOUNT,
    ACCOUNT_ONBOARDING,
    ACCOUNT_LOGIN,
    ACCOUNT_CREATE
} from '$Constants/routes.json';
import { notificationTypes } from '../../constants/notifications';

interface Props {
    unInstallApp: Function;
}

export const AccountPage = ( props: Props ) => {
    return (
        <Switch>
            <Route exact path={ACCOUNT} component={AccountOverview} />
            <Route path={ACCOUNT_ONBOARDING} component={AccountOnBoarding} />
            <Route path={ACCOUNT_LOGIN} component={LoginPage} />
            <Route path={ACCOUNT_CREATE} component={CreateAccountPage} />
        </Switch>
    );
};
