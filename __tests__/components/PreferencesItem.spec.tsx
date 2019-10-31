import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { PreferenceItem } from '$Components/Preferences/PreferenceItem';
import { camelToTitle } from '$Utils/app_utils';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = {
        name: 'autoUpdate',
        status: true,
        disabled: false,
        onChange: jest.fn(),
        ...propOverrides
    };

    const wrapper = shallow( <PreferenceItem {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'Preferences Item', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'render proper case for title', () => {
        const { wrapper, props } = shallowSetup();
        const convertedText = camelToTitle( props.name );
        expect( wrapper.childAt( 0 ).type() ).toEqual( ListItemText );
        expect( wrapper.childAt( 0 ).props().primary ).toEqual( convertedText );
    } );

    it( 'set switch state', () => {
        const { wrapper } = shallowSetup();
        const CustomSwitch = wrapper.find( ListItemSecondaryAction ).childAt( 0 );

        expect( CustomSwitch.props().checked ).toBeTruthy();
        expect( CustomSwitch.props().disabled ).toBeFalsy();
    } );

    it( 'disable switch ', () => {
        const { wrapper } = shallowSetup( {
            disabled: true
        } );
        const CustomSwitch = wrapper.find( ListItemSecondaryAction ).childAt( 0 );
        expect( CustomSwitch.props().disabled ).toBeTruthy();
    } );

    it( 'toggle switch ', () => {
        const { wrapper, props } = shallowSetup();

        const CustomSwitch = wrapper.find( ListItemSecondaryAction ).childAt( 0 );
        CustomSwitch.simulate( 'change' );
        expect( props.onChange ).toHaveBeenCalled();
    } );
} );
