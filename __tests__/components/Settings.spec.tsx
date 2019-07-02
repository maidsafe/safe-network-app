import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { Settings } from '$Components/Settings';
import { Preferences } from '$Components/Preferences';

const shallow = createShallow();

// eslint-disable-next-line unicorn/prevent-abbreviations
const shallowSetup = ( propOverrides? ) => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
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

    it( 'should have title `Settings`', () => {
        const expectedTitle = 'Settings';
        const { wrapper } = shallowSetup();
        const titleElement = wrapper
            .find( Typography )
            .filterWhere( ( n ) => n.prop( 'aria-label' ) === 'title' );
        expect( titleElement.text() ).toEqual( expectedTitle );
    } );

    it( 'should load preferences once', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( Preferences ) ).toHaveLength( 1 );
    } );

    it( 'should go to home on clicking back button', () => {
        const { wrapper, props } = shallowSetup();
        wrapper.find( IconButton ).simulate( 'click' );
        expect( props.history.push ).toHaveBeenCalled();
        expect( props.history.push ).toHaveBeenCalledWith( '/' );
    } );
} );
