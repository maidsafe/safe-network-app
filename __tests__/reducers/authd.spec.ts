import { authd, initialState } from '$Reducers/authd_reducer';
import { TYPES } from '$Actions/alias/authd_actions';
import { generateRandomString } from '$Utils/app_utils';
import { ERRORS } from '$Constants/errors';

jest.mock( 'safe-nodejs', () => ( {
    SafeAuthdClient: jest.fn()
} ) );

describe( 'authd reducer', () => {
    it( 'should return the initial state', () => {
        expect( authd( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'LOG_IN_TO_NETWORK', () => {
        it( 'Should update logged in state on log in', () => {
            const authdAction = {
                isLoggedIn: true,
                error: null
            };
            const nextStore = authd( undefined, {
                type: TYPES.LOG_IN_TO_NETWORK,
                payload: { ...authdAction }
            } );
            expect( nextStore.isLoggedIn ).toEqual( authdAction.isLoggedIn );
        } );

        it( 'Should update logged in state on log out', () => {
            const authdAction = {
                isLoggedIn: false,
                error: null
            };
            const nextStore = authd(
                { isLoggedIn: true, error: null },
                {
                    type: TYPES.LOG_OUT_OF_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( authdAction.isLoggedIn );
        } );

        it( 'Should overwrite a logged in error on success', () => {
            const authdAction = {
                isLoggedIn: true,
                error: null
            };
            const nextStore = authd(
                { isLoggedIn: false, error: 'ups' },
                {
                    type: TYPES.LOG_IN_TO_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( authdAction.isLoggedIn );
            expect( nextStore.error ).toEqual( authdAction.error );
        } );

        it( 'Should update with error on fail', () => {
            const authdAction = {
                isLoggedIn: false,
                error: 'crap'
            };
            const nextStore = authd(
                { isLoggedIn: true, error: null },
                {
                    type: TYPES.LOG_IN_TO_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( authdAction.isLoggedIn );
            expect( nextStore.error ).toEqual( authdAction.error );
        } );

        it( 'clear error', () => {
            const nextStore = authd(
                { isLoggedIn: false, error: '42' },
                {
                    type: TYPES.CLEAR_ERROR
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( false );
            expect( nextStore.error ).toBeNull();
        } );
    } );
} );
