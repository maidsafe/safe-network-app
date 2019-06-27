import React, { Component } from 'react';
import List from '@material-ui/core/List';

import { PreferenceItem } from './PreferenceItem';

import { UserPreferences } from '$Definitions/application.d';
import { generateRandomString } from '$Utils/app_utils';

interface Props {
    userPreferences: UserPreferences;
    onChange: Function;
    items?: Array<string>;
}

export class Preferences extends Component<Props> {
    static defaultProps = {
        items: [
            'autoUpdate',
            'pinToMenuBar',
            'launchOnStart',
            'showDeveloperApps',
            'warnOnAccessingClearnet'
        ]
    };

    private handleChange = ( name: string, changedStatus: boolean ) => {
        const { userPreferences, onChange } = this.props;
        userPreferences[name] = changedStatus;
        onChange( userPreferences );
    };

    render() {
        const { userPreferences = {}, items } = this.props;

        return (
            <List>
                {Object.keys( userPreferences ).map( ( userPreference ) => {
                    if ( !items.includes( userPreference ) ) return null;
                    return (
                        <PreferenceItem
                            key={generateRandomString()}
                            name={userPreference}
                            status={userPreferences[userPreference]}
                            onChange={this.handleChange}
                        />
                    );
                } )}
            </List>
        );
    }
}
