import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { OnBoarding } from '$Components/OnBoarding';
import { Stepper } from '$Components/Stepper';
import {
    ON_BOARDING,
    ON_BOARDING_INTRO,
    ON_BOARDING_BASIC_SETTINGS
} from '$Constants/routes.json';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = {
        appPreferences: {
            shouldOnboard: true
        },
        userPreferences: {
            autoUpdate: false,
            pinToMenuBar: false,
            launchOnStart: false,
            showDeveloperApps: false,
            warnOnAccessingClearnet: false
        },
        isTrayWindow: false,
        triggerSetAsTrayWindow: jest.fn(),
        setAppPreferences: jest.fn(),
        getUserPreferences: jest.fn(),
        setUserPreferences: jest.fn(),
        autoLaunch: jest.fn(),
        history: {
            push: jest.fn()
        },
        location: {
            pathname: ON_BOARDING
        },
        ...propOverrides
    };

    // eslint-disable-next-line react/jsx-props-no-spreading
    const wrapper = shallow( <OnBoarding {...props} /> );

    const instance = wrapper.instance();

    return {
        props,
        instance,
        wrapper
    };
};

describe( 'On Boarding', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'should have a stepper', () => {
        const { wrapper, instance } = shallowSetup();
        expect( wrapper.find( Stepper ).length ).toEqual( 1 );
    } );
} );
