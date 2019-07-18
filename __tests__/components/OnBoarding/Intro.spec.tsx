import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Intro } from '$App/components/OnBoarding/Intro';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign( {}, propOverrides );

    const wrapper = shallow( <Intro {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Intro', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'title should be right', () => {
        const { wrapper } = shallowSetup();
        expect(
            wrapper
                .childAt( 0 )
                .childAt( 0 )
                .text()
        ).toEqual( 'One Place for All SAFE Apps' );
        expect(
            wrapper
                .childAt( 0 )
                .childAt( 0 )
                .prop( 'variant' )
        ).toEqual( 'h5' );
    } );

    it( 'description should be right', () => {
        const { wrapper } = shallowSetup();
        expect(
            wrapper
                .childAt( 0 )
                .childAt( 1 )
                .text()
        ).toEqual(
            'A one-stop shop to access all SAFE Apps and manage instant app updates.'
        );
    } );
} );
