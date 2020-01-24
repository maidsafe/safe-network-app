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
            unInstallApp: jest.fn(),
            openApp: jest.fn(),
            downloadAndInstallApp: jest.fn(),
            application: {
                id: 'safe.browser',
                name: 'SAFE Browser',
                packageName: 'safe-browser',
                repository: 'https://github.com/joshuef/safe_browser',
                latestVersion: '0.1.0',
                type: 'electron'
            }
        };

        store = mockStore( props );

        wrapper = shallow( <ApplicationOverview {...props} /> );
        instance = wrapper.instance();
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
