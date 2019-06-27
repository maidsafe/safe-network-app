import React from 'react';
import { Switch, Route } from 'react-router';

import { HOME } from './constants/routes.json';
import { App } from './containers/App';
import { SettingsPage } from './containers/Settings';

export const Routes = () => (
    <App>
        <Switch>
            {
                // Homepage displays the overview (for now)
            }
            <Route path="/" component={SettingsPage} />
        </Switch>
    </App>
);
