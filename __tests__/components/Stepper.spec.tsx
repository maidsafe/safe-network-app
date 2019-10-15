/**
 * @jest-environment jsdom
 */
import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router';

import { Stepper } from '$App/components/Stepper';
import { ON_BOARDING, ON_BOARDING_INTRO } from '$Constants/routes.json';

const mount = createMount();

const mountSetup = ( propOverrides? ) => {
    const props = {
        showButtons: true,
        noElevation: false,
        theme: 'default',
        onFinish: jest.fn(),
        history: {
            push: jest.fn(),
            goBack: jest.fn()
        },
        steps: [
            { url: ON_BOARDING },
            { url: ON_BOARDING_INTRO, nextText: 'boom' }
        ],
        ...propOverrides
    };

    /* eslint-disable react/jsx-props-no-spreading */
    const wrapper = mount(
        <MemoryRouter initialEntries={[ON_BOARDING_INTRO]}>
            <Stepper {...props} />
        </MemoryRouter>
    );
    /* eslint-disable react/jsx-props-no-spreading */

    return {
        props,
        wrapper
    };
};

describe( 'Stepper', () => {
    it( 'render', () => {
        const { wrapper } = mountSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'Uses nextText', () => {
        const { wrapper } = mountSetup();
        expect( wrapper.html() ).toContain( 'boom' );
    } );

    it( 'handle no elevation', () => {
        const { wrapper } = mountSetup( {
            noElevation: true
        } );

        expect( wrapper.html() ).toContain( 'elevation0' );
    } );

    it( 'default have elevation', () => {
        const { wrapper } = mountSetup();
        expect( wrapper.getElement().props.elevation ).not.toEqual( 0 );
    } );
} );
