import React from 'react';
import { mount, shallow } from 'enzyme';

import configureStore from 'redux-mock-store';

import { ApplicationOverview } from '$App/components/ApplicationOverview';
import { MeatballMenu } from '$App/components/MeatballMenu';
import { AppStateButton } from '$App/components/AppStateButton';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'ApplicationOverview', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    beforeEach( () => {
        props = {
            uninstallApp: jest.fn(),
            openApp: jest.fn(),
            installApp: jest.fn(),
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

        wrapper = shallow( <ApplicationOverview {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'handleDownload', () => {
        it( 'exists', () => {
            expect( instance.handleDownload ).toBeTruthy();
        } );

        it( 'calls installApp', () => {
            instance.handleDownload();
            expect( props.installApp.mock.calls.length ).toEqual( 1 );
        } );
    } );

    describe( 'handleOpen', () => {
        it( 'exists', () => {
            expect( instance.handleOpen ).toBeTruthy();
        } );

        it( 'calls openApp', () => {
            instance.handleOpen();
            expect( props.openApp.mock.calls.length ).toEqual( 1 );
        } );
    } );

    describe( 'handleUninstall', () => {
        it( 'exists', () => {
            expect( instance.handleUninstall ).toBeTruthy();
        } );

        it( 'calls uninstallApp', () => {
            instance.handleUninstall();
            expect( props.uninstallApp.mock.calls.length ).toEqual( 1 );
        } );
    } );

    describe( 'render', () => {
        it( 'one install button', () => {
            expect( wrapper.find( AppStateButton ).exists() ).toBeTruthy();
        } );

        it( 'meatball menu component', () => {
            expect( wrapper.find( MeatballMenu ).exists() ).toBeTruthy();
        } );
    } );
} );
