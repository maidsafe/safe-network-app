import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

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
        onChange: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <Preferences {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Preferences', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'render all preferences by default', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.children() ).toHaveLength( 2 );
    } );

    it( 'render specific preferences', () => {
        const { wrapper } = shallowSetup( {
            requiredItems: {
                autoUpdate: true,
                pinToMenuBar: true,
                launchOnStart: true
            }
        } );
        expect( wrapper.children() ).toHaveLength( 3 );
        expect(
            wrapper
                .children()
                .at( 0 )
                .props().name
        ).toEqual( 'autoUpdate' );
        expect(
            wrapper
                .children()
                .at( 1 )
                .props().name
        ).toEqual( 'pinToMenuBar' );
        expect(
            wrapper
                .children()
                .at( 2 )
                .props().name
        ).toEqual( 'launchOnStart' );
    } );

    it( 'should disable preference', () => {
        const { wrapper } = shallowSetup( {
            requiredItems: {
                autoUpdate: true,
                pinToMenuBar: false
            }
        } );

        expect( wrapper.children() ).toHaveLength( 2 );
        expect(
            wrapper
                .children()
                .at( 0 )
                .props().disabled
        ).toBeFalsy();
        expect(
            wrapper
                .children()
                .at( 1 )
                .props().disabled
        ).toBeTruthy();
    } );

    it( 'triggers onChange on toggled ', () => {
        const { wrapper, props } = shallowSetup();
        wrapper
            .children()
            .at( 0 )
            .props()
            .onChange();
        expect( props.onChange ).toHaveBeenCalled();
        expect( props.onChange ).toHaveBeenCalledWith( props.userPreferences );
    } );

    it( 'handle no user preferences passed from store', () => {
        const { wrapper } = shallowSetup( {
            userPreferences: {}
        } );
        expect( wrapper.children() ).toHaveLength( 0 );
    } );
} );
