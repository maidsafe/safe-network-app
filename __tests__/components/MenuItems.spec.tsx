import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
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
            },
            handleClose: jest.fn()
        };

        store = mockStore( props );

        wrapper = shallow( <MenuItems {...props} /> );
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
        it( 'Default "About" menu option', () => {
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__0` )
                    .text()
            ).toBe( 'About this App...' );
        } );

        it( '"Install" menu option, when application not installed', () => {
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Install' );
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
            wrapper = shallow( <MenuItems {...properties} /> );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Uninstall' );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__2` )
                    .text()
            ).toBe( 'Check for updates' );
        } );

        it( '"Cancel Install" and "Pause Download" menu options, when application is downloading', () => {
            const applicationProperties = {
                ...props.application,
                isDownloading: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow( <MenuItems {...properties} /> );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Cancel Install' );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__2` )
                    .text()
            ).toBe( 'Pause Download' );
        } );

        it( '"Cancel Install" menu option, when application is installing', () => {
            const applicationProperties = {
                ...props.application,
                isInstalling: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow( <MenuItems {...properties} /> );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Cancel Install' );
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
            wrapper = shallow( <MenuItems {...properties} /> );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Cancel Install' );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__2` )
                    .text()
            ).toBe( 'Re-try install' );
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
            wrapper = shallow( <MenuItems {...properties} /> );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__1` )
                    .text()
            ).toBe( 'Open' );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__2` )
                    .text()
            ).toBe( 'Skip this update' );
            expect(
                wrapper
                    .find( `.${props.application.packageName}__menu-item__3` )
                    .text()
            ).toBe( 'Uninstall' );
        } );
    } );
} );
