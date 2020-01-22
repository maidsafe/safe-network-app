import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { HeaderBar } from '$App/components/HeaderBar';

jest.mock( '$Logger' );

const mockStore = configureStore();

describe( 'HeaderBar', () => {
    let wrapper;
    let instance;
    let props; // eslint-disable-line unicorn/prevent-abbreviations
    let store;
    let html;

    beforeEach( () => {
        props = {
            title: 'Manage Apps',
            shouldOnBoard: false
        };

        store = mockStore( props );

        wrapper = shallow(
            <MemoryRouter initialEntries={['/']}>
                <HeaderBar {...props} />
            </MemoryRouter>
        );
        instance = wrapper.instance();
        html = wrapper.html();
    } );

    describe( 'render', () => {
        it( 'has no go back button at /', () => {
            expect( html.includes( 'Go Backwards' ) ).toBeFalsy();
        } );

        it( 'has one go back button anywhere else', () => {
            props = {
                title: 'Manage Apps',
                shouldOnBoard: false
            };
            wrapper = shallow(
                <MemoryRouter initialEntries={['/boom']}>
                    <HeaderBar {...props} />
                </MemoryRouter>
            );
            instance = wrapper.instance();

            html = wrapper.html();

            expect( html.includes( 'Go Backwards' ) ).toBeTruthy();
        } );
    } );
} );
