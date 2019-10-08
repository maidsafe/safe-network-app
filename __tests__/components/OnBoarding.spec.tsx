import React from 'react';
import Fab from '@material-ui/core/Fab';
import { createShallow } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router';

import { OnBoarding } from '$Components/OnBoarding';
import { GetStarted } from '$Components/OnBoarding/GetStarted';
import { Intro } from '$Components/OnBoarding/Intro';
import { BasicSettings } from '$Components/OnBoarding/BasicSettings';
import { Stepper } from '$Components/Stepper';
import {
    ON_BOARDING,
    HOME,
    INTRO,
    BASIC_SETTINGS
} from '$Constants/routes.json';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign(
        {
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
            }
        },
        propOverrides
    );

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

    it( 'stepper should show current position', () => {
        const { wrapper, instance } = shallowSetup();
        expect( wrapper.find( Stepper ).props().steps ).toEqual(
            instance.totalSteps
        );

        wrapper.setState( { currentPosition: 0 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 0 );
        wrapper.setState( { currentPosition: 1 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 1 );
        wrapper.setState( { currentPosition: 2 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 2 );
    } );

    it( 'complete on clicking Next from basic settings page', () => {
        const { wrapper, props } = shallowSetup();
        wrapper.setState( { currentPosition: 2 } );
        wrapper
            .find( Stepper )
            .props()
            .onNext();
        expect( props.setAppPreferences ).toHaveBeenCalled();
    } );
} );
