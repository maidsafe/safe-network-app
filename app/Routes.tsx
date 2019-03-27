import React from 'react';
import { Switch, Route } from 'react-router';

import { HOME } from './constants/routes.json';
import { App } from './containers/App';
import { HomePage } from './containers/HomePage';

export const Routes = () => (
    <App>
        <Switch>
            <Route path={HOME} component={HomePage} />
        </Switch>
    </App>
);
