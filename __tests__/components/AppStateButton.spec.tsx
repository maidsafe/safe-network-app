import React from 'react';
import { mount, shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { AppStateButton } from '$App/components/AppStateButton';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'AppStateButton', () => {
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
                name: 'SAFE Browser',
                packageName: 'safe-browser',
                repository: 'https://github.com/joshuef/safe_browser',
                latestVersion: '0.1.0',
                type: 'userApplications'
            }
        };

        store = mockStore( props );

        wrapper = shallow( <AppStateButton {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'handleDownload', () => {
        it( 'exists', () => {
            expect( instance.handleDownload ).toBeTruthy();
        } );

        it( 'calls downloadAndInstallApp', () => {
            instance.handleDownload();
            expect( props.downloadAndInstallApp.mock.calls.length ).toEqual( 1 );
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

        it( 'calls unInstallApp', () => {
            instance.handleUninstall();
            expect( props.unInstallApp.mock.calls.length ).toEqual( 1 );
        } );
    } );

    describe( 'handleResume', () => {
        it( 'exists', () => {
            expect( instance.handleUninstall ).toBeTruthy();
        } );

        it( 'calls resume', () => {
            instance.handleResumeDownload();
            expect( props.resumeDownload.mock.calls.length ).toEqual( 1 );
        } );
    } );
    describe( 'handlePause', () => {
        it( 'exists', () => {
            expect( instance.handlePauseDownload ).toBeTruthy();
        } );

        it( 'calls pause', () => {
            instance.handlePauseDownload();
            expect( props.pauseDownload.mock.calls.length ).toEqual( 1 );
        } );
    } );

    describe( 'render', () => {
        it( 'has one install button normally', () => {
            expect( wrapper.find( Button ) ).toHaveLength( 1 );
        } );
        it( 'has lno progress circle normally', () => {
            expect( wrapper.find( CircularProgress ) ).toHaveLength( 0 );
        } );

        it( 'has two buttons and progress when updating', () => {
            props = {
                ...props,
                application: {
                    ...props.application,
                    isDownloadingAndUpdating: true,
                    progress: 0.3
                }
            };
            wrapper = shallow( <AppStateButton {...props} /> );

            expect( wrapper.find( Button ) ).toHaveLength( 2 );
            expect( wrapper.find( CircularProgress ) ).toHaveLength( 1 );
        } );

        it( 'has two buttons when downloading, which pause/cancel', () => {
            props = {
                ...props,
                application: {
                    ...props.application,
                    isDownloadingAndInstalling: true
                }
            };
            wrapper = shallow( <AppStateButton {...props} /> );

            expect( wrapper.find( Button ) ).toHaveLength( 2 );

            const action = wrapper.find(
                '[aria-label="Application Action Button"]'
            );
            const secondaryAction = wrapper.find(
                '[aria-label="Application Secondary Action Button"]'
            );

            expect( action ).toHaveLength( 1 );
            expect( secondaryAction ).toHaveLength( 1 );

            action.simulate( 'click' );
            secondaryAction.simulate( 'click' );

            expect( props.pauseDownload ).toHaveBeenCalled();
            expect( props.cancelDownload ).toHaveBeenCalled();
        } );

        it( 'has two buttons when paused and they resume/cancel', () => {
            props = {
                ...props,
                application: {
                    ...props.application,
                    isDownloadingAndInstalling: true,
                    isPaused: true
                }
            };
            wrapper = shallow( <AppStateButton {...props} /> );

            expect( wrapper.find( Button ) ).toHaveLength( 2 );

            const action = wrapper.find(
                '[aria-label="Application Action Button"]'
            );
            const secondaryAction = wrapper.find(
                '[aria-label="Application Secondary Action Button"]'
            );

            expect( action ).toHaveLength( 1 );
            expect( secondaryAction ).toHaveLength( 1 );

            action.simulate( 'click' );
            secondaryAction.simulate( 'click' );

            expect( props.resumeDownload ).toHaveBeenCalled();
            expect( props.cancelDownload ).toHaveBeenCalled();
        } );
    } );
} );
