import React, { Component } from 'react';
import List from '@material-ui/core/List';

import { PreferenceItem } from './PreferenceItem';

import { UserPreferences } from '$Definitions/application.d';
import { generateRandomString } from '$Utils/app_utils';

interface Props {
    userPreferences: UserPreferences;
    requiredItems?: { [item: string]: boolean };
    onChange: Function;
    onChangeLaunchOnStart: Function;
    onChangePinToMenu: Function;
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
        onChange: () => {},
        onChangeLaunchOnStart: () => {},
        onChangePinToMenu: () => {}
    };

    // public static changeCompleted( userPreferences ) {
    //     // Enable or disable auto launch
    //     launchOnLogin( userPreferences.launchOnStart );

    //     // switch between standard or tray window
    //     if ( userPreferences.pinToMenuBar ) {
    //         pinLaunchpadToMenu();
    //     } else {
    //         releaseLaunchpadFromMenu();
    //     }

    //     // Save user preference
    //     storeUserPreferences( userPreferences );
    // }

    private handleChange = ( name: string, changedStatus: boolean ) => {
        const {
            userPreferences,
            onChange,
            onChangeLaunchOnStart,
            onChangePinToMenu
        } = this.props;

        switch ( name ) {
            case 'pinToMenuBar':
                onChangePinToMenu( changedStatus );
                break;
            case 'launchOnStart':
                onChangeLaunchOnStart( changedStatus );
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
