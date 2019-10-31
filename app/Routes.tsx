import React from 'react';
import { Switch, Route } from 'react-router';

import {
    APPLICATION_DETAIL,
    PERMISSIONS,
    HOME,
    SETTINGS,
    ACCOUNT,
    ON_BOARDING
} from './constants/routes.json';
import { AppWindow } from './pages/AppWindow';
import { AccountPage } from './pages/AccountPage';
import { OverviewPage } from './pages/OverviewPage';
import { OnBoardingPage } from './pages/OnBoarding';
import { SettingsPage } from './pages/Settings';
import { ApplicationPage } from './pages/ApplicationPage';
import { PermissionsPage } from './pages/PermissionsPage';

export const Routes = () => (
    <AppWindow>
        <Switch>
            <Route exact path={HOME} component={OverviewPage} />
            <Route path={ON_BOARDING} component={OnBoardingPage} />
            <Route path={SETTINGS} component={SettingsPage} />
            <Route path={ACCOUNT} component={AccountPage} />
            <Route path={PERMISSIONS} component={PermissionsPage} />
            <Route path={APPLICATION_DETAIL} component={ApplicationPage} />
        </Switch>
    </AppWindow>
);
