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
            currentPath: '/'
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
                currentPath: '/boom'
            };
            wrapper = shallow(
                <MemoryRouter initialEntries={['/boom']}>
                    <HeaderBar {...props} />
                </MemoryRouter>
            );
            instance = wrapper.instance();

            html = wrapper.html();

            expect( html.includes( 'Go Backwards' ) ).toBeTruthy();
            expect( html.includes( 'boom' ) ).toBeTruthy();
        } );
    } );
} );
