import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Intro } from '$App/components/OnBoarding/Intro';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = { ...propOverrides };

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
                .prop( 'variant' )
        ).toEqual( 'h6' );
    } );
} );
