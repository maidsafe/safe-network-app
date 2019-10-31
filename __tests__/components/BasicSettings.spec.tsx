import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { BasicSettings } from '$Components/OnBoarding/BasicSettings';
import { Preferences } from '$Components/Preferences';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = {
        userPreferences: {
            autoUpdate: false,
            pinToMenuBar: false
            // launchOnStart: false,
            // showDeveloperApps: false,
            // warnOnAccessingClearnet: false
        },
        setUserPreferences: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <BasicSettings {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Basic Settings', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'should load preferences once', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( Preferences ) ).toHaveLength( 1 );
    } );

    it( 'should have only basic preferences', () => {
        const { wrapper } = shallowSetup();
        const expectedRequiredItems = {
            autoUpdate: true,
            pinToMenuBar: true
            // launchOnStart: true,
            // showDeveloperApps: true
        };
        expect( wrapper.find( Preferences ).props().requiredItems ).toEqual(
            expectedRequiredItems
        );
    } );
} );
