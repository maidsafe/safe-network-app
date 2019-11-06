import { launchpadReducer, initialState } from '$Reducers/launchpad_reducer';
import { TYPES } from '$Actions/launchpad_actions';
import { TYPES as ALIAS__TYPES } from '$Actions/alias/launchpad_actions';
import { generateRandomString } from '$Utils/app_utils';
import { ERRORS } from '$Constants/errors';

describe( 'launchpad reducer', () => {
    it( 'should return the initial state', () => {
        expect( launchpadReducer( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'SET_USER_PREFERENCES', () => {
        it( 'Should update user preferences', () => {
            const userPreferences = {
                autoUpdate: true,
                pinToMenuBar: false,
                launchOnStart: false,
                showDeveloperApps: true,
                warnOnAccessingClearnet: false
            };
            const nextStore = launchpadReducer( undefined, {
                type: TYPES.SET_USER_PREFERENCES,
                payload: { ...userPreferences }
            } );
            expect( nextStore.userPreferences.autoUpdate ).toEqual(
                userPreferences.autoUpdate
            );
            expect( nextStore.userPreferences.pinToMenuBar ).toEqual(
                userPreferences.pinToMenuBar
            );
            expect( nextStore.userPreferences.launchOnStart ).toEqual(
                userPreferences.launchOnStart
            );
            expect( nextStore.userPreferences.showDeveloperApps ).toEqual(
                userPreferences.showDeveloperApps
            );
            expect( nextStore.userPreferences.warnOnAccessingClearnet ).toEqual(
                userPreferences.warnOnAccessingClearnet
            );
        } );

        it( 'Should throw if userPreferences has extra property', () => {
            const userPreferences = {
                myNewPreference: false,
                pinToMenuBar: true,
                launchOnStart: true,
                showDeveloperApps: false
            };

            expect( () =>
                launchpadReducer( undefined, {
                    type: TYPES.SET_USER_PREFERENCES,
                    payload: { ...userPreferences }
                } )
            ).toThrow( ERRORS.INVALID_PROP );
        } );
    } );

    describe( 'PUSH_NOTIFICATION', () => {
        it( 'Should add new notification to the list', () => {
            const store = { ...initialState };
            const newNotification = {
                id: generateRandomString(),
                type: 'ALERT',
                priority: 'HIGH',
                notificationType: 'standard',
                application: {
                    id: generateRandomString()
                }
            };

            const nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: newNotification
            } );

            const expectedNotification =
                nextStore.notifications[newNotification.id];

            expect( expectedNotification.id ).toEqual( newNotification.id );
            expect( expectedNotification.type ).toEqual( newNotification.type );
            expect( expectedNotification.priority ).toEqual(
                newNotification.priority
            );
            expect( expectedNotification.application.id ).toEqual(
                newNotification.application.id
            );
        } );

        it( 'Should able to add notification without app Id (Global notification)', () => {
            const store = { ...initialState };
            const newNotification = {
                id: generateRandomString(),
                type: 'ALERT',
                notificationType: 'standard',
                priority: 'HIGH'
            };

            const nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: newNotification
            } );

            const expectedNotification =
                nextStore.notifications[newNotification.id];

            expect( expectedNotification.id ).toEqual( newNotification.id );
            expect( expectedNotification.type ).toEqual( newNotification.type );
            expect( expectedNotification.priority ).toEqual(
                newNotification.priority
            );
            expect( expectedNotification.application ).toBeUndefined();
        } );
    } );

    describe( 'DISMISS_NOTIFICATION', () => {
        let nextStore = null;
        const notification = {
            type: 'ALERT',
            priority: 'HIGH',
            notificationType: 'standard',
            application: { id: generateRandomString() },
            id: generateRandomString()
        };

        beforeAll( () => {
            const store = { ...initialState };
            nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: notification
            } );
        } );

        it( 'Should remove notification based on ID', () => {
            expect(
                launchpadReducer( nextStore, {
                    type: TYPES.DISMISS_NOTIFICATION,
                    payload: { id: notification.id }
                } ).notifications[notification.id]
            ).toBeUndefined();
        } );
    } );

    describe( 'SET_AS_TRAY_WINDOW', () => {
        it( 'Should update standard-window-is-visible flag', () => {
            expect( initialState.isTrayWindow ).toBeFalsy();
            expect(
                launchpadReducer( initialState, {
                    type: TYPES.SET_AS_TRAY_WINDOW,
                    payload: true
                } ).isTrayWindow
            ).toBeTruthy();
        } );
    } );
} );
