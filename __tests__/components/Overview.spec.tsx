import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { Overview } from '$Components/Overview';
import { ApplicationOverview } from '$App/components/ApplicationOverview';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'Overview', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    beforeEach( () => {
        props = {
            unInstallApp: jest.fn(),
            openApp: jest.fn(),
            downloadAndInstallApp: jest.fn(),
            appPreferences: {
                shouldOnboard: false
            },
            installApp: jest.fn(),
            appList: {
                'safe.browser': {
                    id: 'safe.browser',
                    name: 'SAFE Browser',
                    packageName: 'safe-browser',
                    repository: 'https://github.com/joshuef/safe_browser',
                    latestVersion: '0.1.0',
                    type: 'electron'
                },
                'electron.ts.boiler': {
                    id: 'electron.ts.boiler',
                    name: 'ElectronTypescriptBoiler',
                    packageName: 'ElectronTypescriptBoiler',
                    repository:
                        'https://github.com/joshuef/electron-typescript-react-boilerplate',
                    latestVersion: '0.1.0',
                    type: 'electron'
                }
            },
            fetchLatestAppVersions: jest.fn(),
            triggerSetWindowVisibility: jest.fn()
        };

        store = mockStore( props );

        wrapper = shallow( <Overview {...props} /> );
    } );

    describe( 'constructor', () => {
        beforeEach( () => {
            instance = wrapper.instance();
        } );

        it( 'should have name Overview', () => {
            expect( instance.constructor.name ).toBe( 'Overview' );
        } );
    } );

    describe( 'render', () => {
        it( 'one window-hide button', () => {
            expect(
                wrapper.find( 'button[btn--upper-right]' ).exists
            ).toBeTruthy();
        } );

        it( 'array of ApplicationOverview components', () => {
            expect( wrapper.find( ApplicationOverview ).length ).toEqual( 2 );
        } );
    } );
} );
