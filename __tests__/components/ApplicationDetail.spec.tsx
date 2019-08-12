import React from 'react';
import { mount, shallow } from 'enzyme';

import configureStore from 'redux-mock-store';

import { ApplicationDetail } from '$App/components/ApplicationDetail';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'ApplicationDetail', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;
    let html;

    beforeEach( () => {
        props = {
            match: {
                params: {
                    id: 'safe.browser'
                }
            },
            appList: {
                'safe.browser': {
                    id: 'safe.browser',
                    name: 'SAFE Browser',
                    descrption: 'blablabla',
                    author: 'maidsafe',
                    packageName: 'safe-browser',
                    repositoryOwner: 'joshuef',
                    repositorySlug: 'safe_browser',
                    updateDescription: '',
                    latestVersion: '0.1.0',
                    type: 'userApplications'
                }
            },
            unInstallApp: jest.fn(),
            openApp: jest.fn(),
            downloadAndInstallApp: jest.fn()
        };

        store = mockStore( props );

        wrapper = shallow( <ApplicationDetail {...props} /> );
        instance = wrapper.instance();
        html = wrapper.html();
    } );

    describe( 'render', () => {
        it( 'one install button', () => {
            expect( html.includes( 'button' ) ).toBeTruthy();
        } );

        it( 'one header', () => {
            expect( html.includes( 'h4' ) ).toBeTruthy();
        } );

        it( 'one author', () => {
            expect( html.includes( 'h4' ) ).toBeTruthy();
        } );
    } );
} );
