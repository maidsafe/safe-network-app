/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import configureStore from 'redux-mock-store';

import { CreateAccountPage } from '$Pages/AccountPage/CreateAccountPage';
import { AccountPage } from '$Pages/AccountPage';
import { getByAria } from '';
import { ACCOUNT_CREATE_REDEEM } from '$Constants/routes.json';

jest.mock( '$Logger' );
jest.mock( 'safe-nodejs', () => ( {
    SafeAuthdClient: jest.fn()
} ) );
const mockStore = configureStore();

describe( 'Create CreateAccountPage', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    describe( 'Create Account ', () => {
        beforeEach( () => {
            props = {
                history: { push: jest.fn() },
                isLoggedIn: false,
                isWorking: false,
                setAuthdWorking: jest.fn(),
                createAccount: jest.fn()
            };

            store = mockStore( props );

            /* eslint-disable react/jsx-props-no-spreading */
            wrapper = mount(
                <MemoryRouter initialEntries={[ACCOUNT_CREATE_REDEEM]}>
                    <CreateAccountPage {...props} />
                </MemoryRouter>
            );
            /* eslint-enable react/jsx-props-no-spreading */
        } );

        it( 'Should show Invite first', () => {
            expect( wrapper.find( 'Invite' ).exists ).toBeTruthy();

            expect(
                wrapper.find( {
                    'aria-label': 'Redeem Invite'
                } ).exists
            ).toBeTruthy();
        } );

        it( 'Should show password second', () => {
            wrapper
                .find( {
                    'aria-label': 'Redeem Invite'
                } )
                .hostNodes()
                .simulate( 'click' );

            expect( wrapper.find( 'Password' ).exists ).toBeTruthy();

            expect(
                wrapper.find( {
                    'aria-label': 'Save Password'
                } ).exists
            ).toBeTruthy();
        } );

        it( 'Should show passphrase last, and trigger create account on click', () => {
            wrapper
                .find( {
                    'aria-label': 'Redeem Invite'
                } )
                .hostNodes()
                .simulate( 'click' );

            expect( wrapper.find( 'Password' ).exists ).toBeTruthy();

            wrapper
                .find( {
                    'aria-label': 'Save Password'
                } )
                .hostNodes()
                .simulate( 'click' );

            expect( wrapper.find( 'Passphrase' ).exists ).toBeTruthy();

            wrapper
                .find( {
                    'aria-label': 'Save Passphrase'
                } )
                .hostNodes()
                .simulate( 'click' );

            expect( props.setAuthdWorking ).toHaveBeenCalled();
            expect( props.createAccount ).toHaveBeenCalled();

            expect(
                wrapper.find( {
                    'aria-label': 'Working...'
                } ).exists
            ).toBeTruthy();
        } );
    } );
} );
