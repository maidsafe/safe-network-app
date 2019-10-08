import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';

import { Stepper } from '$App/components/Stepper';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign(
        {
            showButtons: true,
            noElevation: false,
            theme: 'default',
            onNext: jest.fn(),
            onBack: jest.fn(),
            steps: 3,
            activeStep: 0,
            history: {
                push: jest.fn()
            }
        },
        propOverrides
    );

    const wrapper = shallow( <Stepper {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Stepper', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'Go next', () => {
        const { wrapper, props } = shallowSetup();
        wrapper.getElement().props.nextButton.props.onClick();
        expect( props.onNext ).toHaveBeenCalled();
    } );

    it( 'Go back', () => {
        const { wrapper, props } = shallowSetup();
        wrapper.getElement().props.backButton.props.onClick();
        expect( props.onBack ).toHaveBeenCalled();
    } );

    it( 'handle no elevation', () => {
        const { wrapper } = shallowSetup( {
            noElevation: true
        } );
        expect( wrapper.getElement().props.elevation ).toEqual( 0 );
    } );

    it( 'default have elevation', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.getElement().props.elevation ).not.toEqual( 0 );
    } );
} );
