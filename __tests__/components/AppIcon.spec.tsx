import React from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import { createShallow } from '@material-ui/core/test-utils';
import { AppIcon } from '$Components/AppIcon';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = {
        url: '',
        fontSize: 'default',
        className: '',
        ...propOverrides
    };

    const wrapper = shallow( <AppIcon {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'App Icon', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'by default load folder icon', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper.find( FolderIcon ).exists() ).toBeTruthy();
    } );

    it( 'set url to load image', () => {
        const { wrapper } = shallowSetup( { url: '/some/url/for/img.png' } );
        expect( wrapper.find( FolderIcon ).exists() ).toBeFalsy();
    } );
} );
