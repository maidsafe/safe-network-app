import React from 'react';
import { Switch, Route } from 'react-router';

import { HOME } from './constants/routes.json';
import { App } from './containers/App';
import { HomePage } from './containers/HomePage';
import { OnBoardingPage } from './containers/OnBoarding';
import { SettingsPage } from './containers/Settings';

export const Routes = () => (
    <App>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/onBoarding" component={OnBoardingPage} />
            <Route path="/settings" component={SettingsPage} />
        </Switch>
    </App>
);
