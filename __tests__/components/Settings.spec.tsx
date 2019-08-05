import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { Settings } from '$Components/Settings';
import { Preferences } from '$Components/Preferences';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign(
        {
            userPreferences: {
                autoUpdate: false,
                pinToMenuBar: false,
                launchOnStart: false,
                showDeveloperApps: false,
                warnOnAccessingClearnet: false
            },
            setUserPreferences: jest.fn(),
            getUserPreferences: jest.fn(),
            storeUserPreferences: jest.fn(),
            pinToTray: jest.fn(),
            autoLaunch: jest.fn(),
            history: {
                push: jest.fn()
            }
        },
        propOverrides
    );

    const wrapper = shallow( <Settings {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Settings Page', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'should load preferences once', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( Preferences ) ).toHaveLength( 1 );
    } );
} );
