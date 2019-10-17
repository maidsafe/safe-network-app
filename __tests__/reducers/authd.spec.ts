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
                error: null
            };
            const nextStore = authd( undefined, {
                type: TYPES.LOG_IN_TO_NETWORK,
                payload: { ...authdAction }
            } );
            expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toBeNull();
            expect( nextStore.isWorking ).toBeFalsy();
        } );

        it( 'Should update logged in state on log out', () => {
            const authdAction = {
                error: null
            };
            const nextStore = authd(
                { isLoggedIn: true, error: null, isWorking: true },
                {
                    type: TYPES.LOG_OUT_OF_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toBeFalsy();
            expect( nextStore.error ).toBeNull();
            expect( nextStore.isWorking ).toBeFalsy();
        } );

        it( 'Should overwrite a logged in error on success', () => {
            const authdAction = {
                error: null
            };
            const nextStore = authd(
                { isLoggedIn: false, error: 'ups', isWorking: true },
                {
                    type: TYPES.LOG_IN_TO_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toEqual( authdAction.error );
        } );

        it( 'Should overwrite working state on success', () => {
            const authdAction = {
                error: null
            };
            const nextStore = authd(
                { isLoggedIn: false, error: 'ups', isWorking: true },
                {
                    type: TYPES.LOG_IN_TO_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toEqual( authdAction.error );
            expect( nextStore.isWorking ).toBeFalsy();
        } );

        it( 'Should update with error on fail', () => {
            const authdAction = {
                error: 'crap'
            };
            const nextStore = authd(
                { isLoggedIn: false, error: null, isWorking: false },
                {
                    type: TYPES.LOG_IN_TO_NETWORK,
                    payload: { ...authdAction }
                }
            );
            expect( nextStore.isLoggedIn ).toBeFalsy();
            expect( nextStore.error ).toEqual( authdAction.error );
        } );

        it( 'clear error', () => {
            const nextStore = authd(
                { isLoggedIn: false, error: '42', isWorking: false },
                {
                    type: TYPES.CLEAR_ERROR
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( false );
            expect( nextStore.error ).toBeNull();
        } );

        it( 'update working state', () => {
            const nextStore = authd(
                { isLoggedIn: false, error: '42', isWorking: false },
                {
                    type: TYPES.SET_AUTHD_WORKING
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( false );
            expect( nextStore.error ).toEqual( '42' );
        } );
    } );
} );
