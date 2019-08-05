import React from 'react';
import { Switch, Route } from 'react-router';

import {
    APPLICATION_DETAIL,
    HOME,
    SETTINGS,
    ON_BOARDING
} from './constants/routes.json';
import { AppWindow } from './containers/AppWindow';
import { HomePage } from './containers/HomePage';
import { OnBoardingPage } from './containers/OnBoarding';
import { SettingsPage } from './containers/Settings';
import { ApplicationPage } from './containers/ApplicationPage';

export const Routes = () => (
    <AppWindow>
        <Switch>
            <Route exact path={HOME} component={HomePage} />
            <Route path={ON_BOARDING} component={OnBoardingPage} />
            <Route path={SETTINGS} component={SettingsPage} />
            <Route path={APPLICATION_DETAIL} component={ApplicationPage} />
        </Switch>
    </AppWindow>
);
