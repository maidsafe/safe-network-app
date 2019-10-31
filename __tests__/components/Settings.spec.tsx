import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { Settings } from '$Components/Settings';
import { Preferences } from '$Components/Preferences';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = {
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
        quitApplication: jest.fn(),
        isTrayWindow: false,
        history: {
            push: jest.fn()
        },
        ...propOverrides
    };

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

    it( 'Hide quit option on standard window', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( ListItem ) ).toHaveLength( 0 );
    } );

    it( 'Show quit option on switching to tray window', () => {
        const { wrapper } = shallowSetup( { isTrayWindow: true } );
        expect( wrapper.find( ListItem ) ).toHaveLength( 1 );
    } );
} );
