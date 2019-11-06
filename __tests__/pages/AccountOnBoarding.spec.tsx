/**
 * @jest-environment jsdom
 */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import configureStore from 'redux-mock-store';

import { AccountOnBoarding } from '$Pages/AccountPage/AccountOnBoarding';
// import { getByAria } from '../helpers';
import { ACCOUNT_ONBOARDING } from '$Constants/routes.json';

jest.mock( '$Logger' );
jest.mock( 'safe-nodejs', () => ( {
    SafeAuthdClient: jest.fn()
} ) );
const mockStore = configureStore();

describe( 'Account Onboarding', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;

    describe( 'Account OnBoarding', () => {
        beforeEach( () => {
            props = {
                history: { push: jest.fn() },
                authd: {
                    isLoggedIn: false,
                    isWorking: false,
                    setAuthdWorking: jest.fn(),
                    createAccount: jest.fn()
                }
            };

            store = mockStore( props );

            /* eslint-disable react/jsx-props-no-spreading */
            wrapper = mount(
                <MemoryRouter initialEntries={[ACCOUNT_ONBOARDING]}>
                    <Provider store={store}>
                        <AccountOnBoarding {...props} />
                    </Provider>
                </MemoryRouter>
            );
            /* eslint-enable react/jsx-props-no-spreading */
        } );

        it( 'Should show stepper', () => {
            expect( wrapper.find( 'AccountOnBoarding' ).exists ).toBeTruthy();
            expect( wrapper.find( 'StepperPage' ).exists ).toBeTruthy();

            expect(
                wrapper.find( {
                    'aria-label': 'NextStepButton'
                } ).exists
            ).toBeTruthy();
        } );

        // TODO: change this behaviour when we want account overview proper
        it( 'should trigger go to create password on complete', () => {
            expect(
                wrapper.find( { 'aria-label': 'NextStepButton' } ).exists
            ).toBeTruthy();

            wrapper
                .find( { 'aria-label': 'NextStepButton' } )
                .hostNodes()
                .simulate( 'click' );
            wrapper
                .find( { 'aria-label': 'NextStepButton' } )
                .hostNodes()
                .simulate( 'click' );
            wrapper
                .find( { 'aria-label': 'NextStepButton' } )
                .hostNodes()
                .simulate( 'click' );

            expect(
                wrapper.find( { 'aria-label': 'Create Password Field' } ).exists
            ).toBeTruthy();
        } );
    } );
} );
