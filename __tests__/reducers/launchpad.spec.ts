import { launchpadReducer, initialState } from '$Reducers/launchpad_reducer';
import { TYPES } from '$Actions/launcher_actions';
import { generateRandomString } from '$Utils/app_utils';
import { ERRORS } from '$App/constants';

describe( 'launchpad reducer', () => {
    it( 'should return the initial state', () => {
        expect( launchpadReducer( undefined, {} ) ).toEqual( initialState );
    } );

    describe( 'SHOULD_ONBOARD', () => {
        it( 'Should update On-Boarding flag', () => {
            expect(
                launchpadReducer( undefined, {
                    type: TYPES.SHOULD_ONBOARD,
                    payload: {
                        shouldOnboard: true
                    }
                } ).shouldOnboard
            ).toBeTruthy();
        } );
        it( 'Should throw if invalid value passed', () => {
            expect( () =>
                launchpadReducer( undefined, {
                    type: TYPES.SHOULD_ONBOARD,
                    payload: {
                        shouldOnboard: 'false'
                    }
                } )
            ).toThrow( ERRORS.INVALID_TYPE );
        } );
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
                payload: {
                    userPreferences: { ...userPreferences }
                }
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
                    payload: {
                        userPreferences: { ...userPreferences }
                    }
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
                appId: generateRandomString()
            };

            const nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: {
                    notification: { ...newNotification }
                }
            } );

            const expectedNotification =
                nextStore.notifications[newNotification.id];

            expect( expectedNotification.id ).toEqual( newNotification.id );
            expect( expectedNotification.type ).toEqual( newNotification.type );
            expect( expectedNotification.priority ).toEqual(
                newNotification.priority
            );
            expect( expectedNotification.appId ).toEqual( newNotification.appId );
        } );

        it( 'Should able to add notification without app Id (Global notification)', () => {
            const store = { ...initialState };
            const newNotification = {
                id: generateRandomString(),
                type: 'ALERT',
                priority: 'HIGH'
            };

            const nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: {
                    notification: { ...newNotification }
                }
            } );

            const expectedNotification =
                nextStore.notifications[newNotification.id];

            expect( expectedNotification.id ).toEqual( newNotification.id );
            expect( expectedNotification.type ).toEqual( newNotification.type );
            expect( expectedNotification.priority ).toEqual(
                newNotification.priority
            );
            expect( expectedNotification.appId ).toBeUndefined();
        } );

        it( 'Should throw if notification id is not available', () => {
            const store = { ...initialState };
            const newNotification = {
                type: 'ALERT',
                priority: 'HIGH',
                appId: generateRandomString()
            };
            expect( () =>
                launchpadReducer( store, {
                    type: TYPES.PUSH_NOTIFICATION,
                    payload: {
                        notification: { ...newNotification }
                    }
                } )
            ).toThrow( ERRORS.NOTIFICATION_ID_NOT_FOUND );
        } );
    } );

    describe( 'DISMISS_NOTIFICATION', () => {
        let nextStore = null;
        const notification = {
            type: 'ALERT',
            priority: 'HIGH',
            appId: generateRandomString(),
            id: generateRandomString()
        };

        beforeAll( () => {
            const store = { ...initialState };
            nextStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: {
                    notification: { ...notification }
                }
            } );
        } );

        it( 'Should throw if notification ID not set', () => {
            expect( () =>
                launchpadReducer( nextStore, {
                    type: TYPES.DISMISS_NOTIFICATION,
                    payload: {}
                } )
            ).toThrow( ERRORS.NOTIFICATION_ID_NOT_FOUND );
        } );

        it( 'Should remove notification based on ID', () => {
            expect(
                launchpadReducer( nextStore, {
                    type: TYPES.DISMISS_NOTIFICATION,
                    payload: {
                        notificationId: notification.id
                    }
                } ).notifications[notification.id]
            ).toBeUndefined();
        } );
    } );
} );
