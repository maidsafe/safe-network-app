import React, { Component } from 'react';
import List from '@material-ui/core/List';

import { PreferenceItem } from './PreferenceItem';

import { UserPreferences } from '$Definitions/application.d';
import { generateRandomString } from '$Utils/app_utils';
import {
    launchOnLogin,
    pinLaunchpadToMenu,
    releaseLaunchpadFromMenu,
    storeUserPreferences
} from '$App/actions/launchpad_actions';

interface Props {
    userPreferences: UserPreferences;
    onChange: Function;
    requiredItems?: { [item: string]: boolean };
}

export class Preferences extends Component<Props> {
    static defaultProps = {
        userPreference: {},
        requiredItems: {
            autoUpdate: true,
            pinToMenuBar: true,
            launchOnStart: true,
            showDeveloperApps: true,
            warnOnAccessingClearnet: true
        },
        onChange: () => {}
    };

    public static changeCompleted( userPreferences ) {
        // Enable or disable auto launch
        launchOnLogin( userPreferences.launchOnStart );

        // switch between standard or tray window
        if ( userPreferences.pinToMenuBar ) {
            pinLaunchpadToMenu();
        } else {
            releaseLaunchpadFromMenu();
        }

        // Save user preference
        storeUserPreferences( userPreferences );
    }

    private handleChange = ( name: string, changedStatus: boolean ) => {
        const { userPreferences, onChange } = this.props;
        switch ( name ) {
            case 'pinToMenuBar':
                if ( changedStatus ) {
                    pinLaunchpadToMenu();
                } else {
                    releaseLaunchpadFromMenu();
                }
                break;
            case 'launchOnStart':
                launchOnLogin( changedStatus );
                break;
            default:
                break;
        }

        userPreferences[name] = changedStatus;
        if ( typeof onChange === 'function' ) {
            onChange( userPreferences );
        }
    };

    render() {
        const { userPreferences, requiredItems } = this.props;
        const requiredItemArray = Object.keys( requiredItems );

        return (
            <List aria-label="Preferences">
                {Object.keys( userPreferences ).map( ( userPreference ) => {
                    if ( !requiredItemArray.includes( userPreference ) )
                        return null;

                    return (
                        <PreferenceItem
                            key={generateRandomString()}
                            name={userPreference}
                            status={userPreferences[userPreference]}
                            onChange={this.handleChange}
                            disabled={!requiredItems[userPreference]}
                        />
                    );
                } )}
            </List>
        );
    }
}
