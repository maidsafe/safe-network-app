/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import configureStore from 'redux-mock-store';

import { AccountPage } from '$Pages/AccountPage';
import { getByAria } from '';
import { ACCOUNT, ACCOUNT_CREATE_REDEEM } from '$Constants/routes.json';

jest.mock( '$Logger' );
jest.mock( 'safe-nodejs', () => ( {
    SafeAuthdClient: jest.fn()
} ) );
const mockStore = configureStore();

describe( 'AccountPage', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    beforeEach( () => {
        props = {
            authd: {
                isWorking: false,
                isLoggedIn: false,
                error: null
            },
            history: { push: jest.fn() }
        };

        store = mockStore( props );

        /* eslint-disable react/jsx-props-no-spreading */
        wrapper = mount(
            <MemoryRouter initialEntries={[ACCOUNT]}>
                <Provider store={store}>
                    <AccountPage {...props} />
                </Provider>
            </MemoryRouter>
        );
        /* eslint-enable react/jsx-props-no-spreading */
    } );

    describe( 'Account', () => {
        it( 'Should show account overview', () => {
            expect( wrapper.find( 'AccountOverview' ).exists ).toBeTruthy();

            expect(
                wrapper.find( {
                    'aria-label': 'Get Invite'
                } ).exists
            ).toBeTruthy();
        } );

        it( 'Get invite card exists', () => {
            expect(
                wrapper.find( {
                    'aria-label': 'Get Invite'
                } ).exists
            ).toBeTruthy();
        } );
        it( 'Request invite card exists', () => {
            expect(
                wrapper.find( {
                    'aria-label': 'Request Invite'
                } ).exists
            ).toBeTruthy();
        } );

        it( 'Earn invite card exists', () => {
            expect(
                wrapper.find( {
                    'aria-label': 'Earn Invite'
                } ).exists
            ).toBeTruthy();
        } );

        it( 'Already have invite exists', () => {
            expect(
                wrapper.find( {
                    'aria-label': 'IAlreadyHaveInvite'
                } ).exists
            ).toBeTruthy();
        } );
    } );
} );
