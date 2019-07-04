import React from 'react';
import { Switch, Route } from 'react-router';

import { HOME, SETTINGS, ON_BOARDING } from './constants/routes.json';
import { App } from './containers/App';
import { HomePage } from './containers/HomePage';
import { OnBoardingPage } from './containers/OnBoarding';
import { SettingsPage } from './containers/Settings';

export const Routes = () => (
    <App>
        <Switch>
            <Route exact path={HOME} component={HomePage} />
            <Route path={ON_BOARDING} component={OnBoardingPage} />
            <Route path={SETTINGS} component={SettingsPage} />
        </Switch>
    </App>
);
