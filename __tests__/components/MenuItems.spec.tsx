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
            resumeDownload: jest.fn(),
            pauseDownload: jest.fn(),
            cancelDownload: jest.fn(),
            openApp: jest.fn(),
            downloadAndInstallApp: jest.fn(),
            application: {
                id: 'safe.browser',
                name: 'Safe Browser',
                packageName: 'safe-browser',
                repository: 'https://github.com/joshuef/safe_browser',
                latestVersion: '0.1.0',
                type: 'electron'
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

    describe( 'render', () => {
        it( 'Default "About" menu option', () => {
            expect( wrapper.html().includes( 'About Safe Browser' ) ).toBeTruthy();
        } );

        it( '"Install" menu option, when application not installed', () => {
            expect( wrapper.html().includes( 'Install' ) ).toBeTruthy();
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

        it( '"Cancel Install" and "Pause" menu option, when application is installing', () => {
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
            )
                .children()
                .dive();

            const cancel = wrapper.find( `[aria-label="Cancel Download"]` );
            expect( cancel ).toHaveLength( 1 );
            cancel.simulate( 'click' );
            expect( props.cancelDownload ).toHaveBeenCalled();

            const pauseDownload = wrapper.find( `[aria-label="Pause Download"]` );
            expect( pauseDownload ).toHaveLength( 1 );
            pauseDownload.simulate( 'click' );
            expect( props.pauseDownload ).toHaveBeenCalled();
        } );

        it( 'has "Cancel Install" and "Resume" menu options, when application is paused', () => {
            const applicationProperties = {
                ...props.application,
                isDownloadingAndInstalling: true,
                isPaused: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            )
                .children()
                .dive();

            const cancel = wrapper.find( `[aria-label="Cancel Download"]` );
            expect( cancel ).toHaveLength( 1 );
            cancel.simulate( 'click' );
            expect( props.cancelDownload ).toHaveBeenCalled();

            const resumeDownload = wrapper.find(
                `[aria-label="Resume Download"]`
            );
            expect( resumeDownload ).toHaveLength( 1 );
            resumeDownload.simulate( 'click' );
            expect( props.resumeDownload ).toHaveBeenCalled();
        } );

        // it( '"Cancel Install" and "Re-try install" menu options, when application failed to install', () => {
        //     const applicationProperties = {
        //         ...props.application,
        //         installFailed: true
        //     };
        //     const properties = {
        //         ...props,
        //         application: applicationProperties
        //     };
        //     wrapper = shallow(
        //         <MemoryRouter>
        //             <MenuItems {...properties} />
        //         </MemoryRouter>
        //     ).children();
        //     expect( wrapper.html().includes( 'Retry Install' ) ).toBeTruthy();
        // } );

        it( '"Open", "Uninstall" menu options, when application installed', () => {
            const applicationProperties = {
                ...props.application,
                isInstalled: true
                // hasUpdate: true
            };
            const properties = {
                ...props,
                application: applicationProperties
            };
            wrapper = shallow(
                <MemoryRouter>
                    <MenuItems {...properties} />
                </MemoryRouter>
            )
                .children()
                .dive(); // get MenuItems not MemoryRouter

            const open = wrapper.find(
                `[aria-label="Open ${applicationProperties.name}"]`
            );
            expect( open ).toHaveLength( 1 );
            open.simulate( 'click' );
            expect( props.openApp ).toHaveBeenCalled();

            const unInstallApp = wrapper.find(
                `[aria-label="Uninstall ${applicationProperties.name}"]`
            );
            expect( unInstallApp ).toHaveLength( 1 );
            unInstallApp.simulate( 'click' );
            expect( props.unInstallApp ).toHaveBeenCalled();
        } );
    } );
} );
