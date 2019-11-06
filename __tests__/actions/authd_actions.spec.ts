import * as authdActions from '$Actions/alias/authd_actions';

jest.mock( 'safe-nodejs', () => ( {
    SafeAuthdClient: jest.fn()
} ) );

describe( 'Auth daemon actions', () => {
    it( 'should have types', () => {
        expect( authdActions.TYPES ).toBeDefined();
    } );

    it( 'should login', () => {
        expect( authdActions.logInToNetwork ).toBeDefined();
        expect( authdActions.logInToNetwork().type ).toEqual( 'ALIASED' );
    } );

    it( 'clear error', () => {
        expect( authdActions.clearError ).toBeDefined();
        expect( authdActions.clearError().type ).toEqual( 'CLEAR_ERROR' );
    } );

    it( 'can logout', () => {
        expect( authdActions.logOutOfNetwork ).toBeDefined();
        expect( authdActions.logOutOfNetwork().type ).toEqual( 'ALIASED' );
    } );

    it( 'can set authd as working', () => {
        expect( authdActions.setAuthdWorking ).toBeDefined();
        expect( authdActions.setAuthdWorking().type ).toEqual(
            'SET_AUTHD_WORKING'
        );
    } );

    it( 'should create account', () => {
        expect( authdActions.createAccount ).toBeDefined();
        expect( authdActions.createAccount().type ).toEqual( 'ALIASED' );
    } );

    it( 'should allow req', () => {
        expect( authdActions.allowAuthRequest ).toBeDefined();
        expect( authdActions.allowAuthRequest().type ).toEqual( 'ALIASED' );
    } );

    it( 'should deny req', () => {
        expect( authdActions.denyAuthRequest ).toBeDefined();
        expect( authdActions.denyAuthRequest().type ).toEqual( 'ALIASED' );
    } );

    it( 'should add pending req', () => {
        expect( authdActions.addAuthRequestToPendingList ).toBeDefined();
        expect( authdActions.addAuthRequestToPendingList().type ).toEqual(
            'ADD_AUTH_REQUEST_TO_PENDING_LIST'
        );
    } );
} );
