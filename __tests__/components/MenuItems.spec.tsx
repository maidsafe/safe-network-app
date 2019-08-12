import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { MenuItem } from '@material-ui/core';
import { MenuItems } from '$Components/MeatballMenu/MenuItems/MenuItems';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'MenuItems', () => {
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
            },
            handleClose: jest.fn()
        };

        store = mockStore( props );

        wrapper = shallow(
            <MemoryRouter>
                <MenuItems {...props} />
            </MemoryRouter>
        );

        instance = wrapper.instance();
    } );

    // describe( 'handleDownload', () => {
    //     it( 'exists', () => {
    //         expect( instance.handleDownload ).toBeTruthy();
    //     } );
    //
    //     it( 'calls downloadAndInstallApp', () => {
    //         instance.handleDownload();
    //         expect( props.downloadAndInstallApp.mock.calls.length ).toEqual( 1 );
    //     } );
    // } );
    //
    // describe( 'handleOpen', () => {
    //     it( 'exists', () => {
    //         expect( instance.handleOpen ).toBeTruthy();
    //     } );
    //
    //     it( 'calls openApp', () => {
    //         instance.handleOpen();
    //         expect( props.openApp.mock.calls.length ).toEqual( 1 );
    //     } );
    // } );
    //
    // describe( 'handleUninstall', () => {
    //     it( 'exists', () => {
    //         expect( instance.handleUninstall ).toBeTruthy();
    //     } );
    //
    //     it( 'calls unInstallApp', () => {
    //         instance.handleUninstall();
    //         expect( props.unInstallApp.mock.calls.length ).toEqual( 1 );
    //     } );
    // } );

    describe( 'render', () => {
        it( 'Default "About" menu option', () => {
            expect( wrapper.html().includes( 'About SAFE Browser' ) ).toBeTruthy();
        } );

        it( '"Install" menu option, when application not installed', () => {
            expect( wrapper.html().includes( 'Install' ) ).toBeTruthy();
        } );

        it( '"Uninstall" and "Check for updates" menu options, when application is installed', () => {
            const applicationProperties = {
                ...props.application,
                isInstalled: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            );

            expect( wrapper.html().includes( 'Uninstall' ) ).toBeTruthy();
            expect( wrapper.html().includes( 'Check For Updates' ) ).toBeTruthy();
        } );

        it( '"Cancel Install" and "Pause Download" menu options, when application is downloading', () => {
            const applicationProperties = {
                ...props.application,
                isDownloadingAndInstalling: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            );
            expect( wrapper.html().includes( 'Cancel Install' ) ).toBeTruthy();

            expect( wrapper.html().includes( 'Pause Download' ) ).toBeTruthy();
        } );

        it( '"Cancel Install" menu option, when application is installing', () => {
            const applicationProperties = {
                ...props.application,
                isDownloadingAndInstalling: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            );

            expect( wrapper.html().includes( 'Cancel Install' ) ).toBeTruthy();
        } );

        it( '"Cancel Install" and "Re-try install" menu options, when application failed to install', () => {
            const applicationProperties = {
                ...props.application,
                installFailed: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            );
            expect( wrapper.html().includes( 'Retry Install' ) ).toBeTruthy();
        } );

        it( '"Open", "Skip this update", "Uninstall" menu options, when application has updates', () => {
            const applicationProperties = {
                ...props.application,
                isInstalled: true,
                hasUpdate: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            );
            expect( wrapper.html().includes( 'Open' ) ).toBeTruthy();
            expect( wrapper.html().includes( 'Skip This Update' ) ).toBeTruthy();
            expect( wrapper.html().includes( 'Uninstall' ) ).toBeTruthy();
        } );
    } );
} );
