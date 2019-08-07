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
            uninstallApp: jest.fn(),
            openApp: jest.fn(),
            fetchUpdateInfo: jest.fn(),
            installApp: jest.fn()
        };

        store = mockStore( props );

        wrapper = shallow( <ApplicationDetail {...props} /> );
        instance = wrapper.instance();
        html = wrapper.html();
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
