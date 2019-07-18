import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { GetStarted } from '$App/components/OnBoarding/GetStarted';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign(
        {
            onClickGetStarted: jest.fn()
        },
        propOverrides
    );

    const wrapper = shallow( <GetStarted {...props} /> );

    return {
        props,
        wrapper
    };
};

const getContainer = ( wrapper ) => wrapper.childAt( 1 );

describe( 'Get Started', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'title should be right', () => {
        const { wrapper } = shallowSetup();
        expect(
            getContainer( wrapper )
                .childAt( 0 )
                .text()
        ).toEqual( 'SAFE Launchpad' );
        expect(
            getContainer( wrapper )
                .childAt( 0 )
                .prop( 'variant' )
        ).toEqual( 'h5' );
    } );

    it( 'description should be right', () => {
        const { wrapper } = shallowSetup();
        expect(
            getContainer( wrapper )
                .childAt( 1 )
                .text()
        ).toEqual( 'All the apps you need to try the SAFE Network' );
    } );

    it( 'clicking Get Started button works', () => {
        const { wrapper, props } = shallowSetup();
        getContainer( wrapper )
            .childAt( 2 )
            .props()
            .onClick();
        expect( props.onClickGetStarted ).toHaveBeenCalled();
    } );
} );
