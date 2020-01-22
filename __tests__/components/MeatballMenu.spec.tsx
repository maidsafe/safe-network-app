import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { MoreVert } from '@material-ui/icons';

import { MeatballMenu } from '$Components/MeatballMenu';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'MeatballMenu', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    beforeEach( () => {
        props = {
            unInstallApp: jest.fn(),
            openApp: jest.fn(),
            downloadAndInstallApp: jest.fn(),
            application: {
                id: 'safe.browser',
                name: 'SAFE Browser',
                packageName: 'safe-browser',
                repository: 'https://github.com/joshuef/safe_browser',
                latestVersion: '0.1.0',
                type: 'userApplications'
            }
        };

        store = mockStore( props );

        wrapper = shallow( <MeatballMenu {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'handleClick', () => {
        it( 'updates component state', () => {
            instance.handleClick( { currentTarget: 'mock' } );
            expect( instance.state ).toEqual( { menuAnchorElement: 'mock' } );
        } );
    } );

    describe( 'handleClose', () => {
        it( 'updates component state', () => {
            instance.handleClick( { currentTarget: 'mock' } );
            instance.handleClose();
            expect( instance.state ).toEqual( { menuAnchorElement: null } );
        } );
    } );

    describe( 'render', () => {
        it( 'meatball icon', () => {
            expect( wrapper.find( MoreVert ).exists() ).toBeTruthy();
        } );
    } );
} );
