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

    describe( 'AUTH REQUEST HANDLING', () => {
        it( 'Should add action to pending list', () => {
            const authdAction = {
                requestId: 22,
                appId: 'testApp'
            };

            const nextStore = authd( undefined, {
                type: TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST,
                payload: { ...authdAction }
            } );

            // expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toBeNull();
            expect( nextStore.pendingRequests.length ).toEqual( 1 );
            expect( nextStore.pendingRequests ).toContainEqual(
                expect.objectContaining( authdAction )
            );
            expect( nextStore.isWorking ).toBeFalsy();
        } );

        it( 'Added action to be uniq', () => {
            const authdAction = {
                requestId: 22,
                appId: 'testApp'
            };

            const nextStore = authd( undefined, {
                type: TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST,
                payload: { ...authdAction }
            } );

            const nextStore2 = authd( nextStore, {
                type: TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST,
                payload: { ...authdAction }
            } );

            // expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore2.error ).toBeNull();
            expect( nextStore2.pendingRequests.length ).toEqual( 1 );
            expect( nextStore2.pendingRequests ).toContainEqual(
                expect.objectContaining( authdAction )
            );
            expect( nextStore2.isWorking ).toBeFalsy();
        } );

        it( 'should throw with no appid', () => {
            const authdAction = {
                requestId: 22
            };

            expect( () =>
                authd( undefined, {
                    type: TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST,
                    payload: { ...authdAction }
                } )
            ).toThrowError( /appId/ );
        } );

        it( 'should throw with no requestId', () => {
            const authdAction = {
                appId: 22
            };

            expect( () =>
                authd( undefined, {
                    type: TYPES.ADD_AUTH_REQUEST_TO_PENDING_LIST,
                    payload: { ...authdAction }
                } )
            ).toThrowError( /requestId/ );
        } );

        it( 'Should remove action on allow', () => {
            const authdAction = {
                requestId: 22
            };

            const nextStore = authd(
                {
                    isLoggedIn: true,
                    error: null,
                    isWorking: false,
                    pendingRequests: [{ appId: 'hi', requestId: 22 }]
                },
                {
                    type: TYPES.AUTHD_ALLOW_REQUEST,
                    payload: { ...authdAction }
                }
            );

            // expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toBeNull();
            expect( nextStore.pendingRequests.length ).toEqual( 0 );
            expect( nextStore.pendingRequests ).not.toContainEqual(
                expect.objectContaining( authdAction )
            );
            expect( nextStore.isWorking ).toBeFalsy();
        } );

        it( 'Should remove action on deny', () => {
            const authdAction = {
                requestId: 22
            };

            const nextStore = authd(
                {
                    isLoggedIn: true,
                    error: null,
                    isWorking: false,
                    pendingRequests: [{ appId: 'hi', requestId: 22 }]
                },
                {
                    type: TYPES.AUTHD_DENY_REQUEST,
                    payload: { ...authdAction }
                }
            );

            // expect( nextStore.isLoggedIn ).toBeTruthy();
            expect( nextStore.error ).toBeNull();
            expect( nextStore.pendingRequests.length ).toEqual( 0 );
            expect( nextStore.pendingRequests ).not.toContainEqual(
                expect.objectContaining( authdAction )
            );
            expect( nextStore.isWorking ).toBeFalsy();
        } );
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
                {
                    isLoggedIn: true,
                    error: null,
                    isWorking: true,
                    pendingRequests: []
                },
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
                {
                    isLoggedIn: false,
                    error: 'ups',
                    isWorking: true,
                    pendingRequests: []
                },
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
                {
                    isLoggedIn: false,
                    error: 'ups',
                    isWorking: true,
                    pendingRequests: []
                },
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
                {
                    isLoggedIn: false,
                    error: null,
                    isWorking: false,
                    pendingRequests: []
                },
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
                {
                    isLoggedIn: false,
                    error: '42',
                    isWorking: false,
                    pendingRequests: []
                },
                {
                    type: TYPES.CLEAR_ERROR
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( false );
            expect( nextStore.error ).toBeNull();
        } );

        it( 'update working state', () => {
            const nextStore = authd(
                {
                    isLoggedIn: false,
                    error: '42',
                    isWorking: false,
                    pendingRequests: []
                },
                {
                    type: TYPES.SET_AUTHD_WORKING
                }
            );
            expect( nextStore.isLoggedIn ).toEqual( false );
            expect( nextStore.error ).toEqual( '42' );
        } );
    } );
} );
