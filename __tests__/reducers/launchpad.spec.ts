import { launchpadReducer, initialState } from '$Reducers/launchpad_reducer';
import { TYPES } from '$Actions/launcher_actions';
import { generateRandomString } from '../../app/utils/app_utils';

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
            ).toThrow();
        } );
    } );

    describe( 'GET_USER_PREFERENCES or UPDATE_USER_PREFERENCES', () => {
        it( 'Should update user preferences', () => {
            const userPreferences = {
                autoUpdate: true,
                pinToMenuBar: false,
                launchOnStart: false,
                showDeveloperApps: true,
                warnOnAccessingClearnet: false
            };
            const nextStore = launchpadReducer( undefined, {
                type: TYPES.GET_USER_PREFERENCES,
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
                autoUpdates: false,
                pinToMenuBar: true,
                launchOnStart: true,
                showDeveloperApps: false
            };

            expect( () =>
                launchpadReducer( undefined, {
                    type: TYPES.GET_USER_PREFERENCES,
                    payload: {
                        userPreferences: { ...userPreferences }
                    }
                } )
            ).toThrow();
        } );
    } );

    describe( 'CHECK_LAUNCHPAD_HAS_UPDATE', () => {
        it( 'Should update for launchpad new update available', () => {
            const launchpad = { ...initialState.launchpad };
            launchpad.hasUpdate = true;
            launchpad.newVersion = '0.12.0';

            const updatedState = launchpadReducer( undefined, {
                type: TYPES.CHECK_LAUNCHPAD_HAS_UPDATE,
                payload: { launchpad: { ...launchpad } }
            } );

            expect( updatedState.launchpad.hasUpdate ).toBeTruthy();
            expect( updatedState.launchpad.newVersion ).toEqual(
                launchpad.newVersion
            );
        } );

        it( 'make no change on no update available', () => {
            const launchpad = { ...initialState.launchpad };
            launchpad.hasUpdate = false;
            launchpad.newVersion = '0.12.0';

            const updatedState = launchpadReducer( undefined, {
                type: TYPES.CHECK_LAUNCHPAD_HAS_UPDATE,
                payload: { launchpad: { ...launchpad } }
            } );

            expect( updatedState.launchpad.hasUpdate ).toBeFalsy();
            expect( updatedState.launchpad.newVersion ).toEqual(
                initialState.launchpad.newVersion
            );
        } );
    } );

    describe( 'UPDATE_LAUNCHPAD', () => {
        it( 'Should not update when no new update available', () => {
            expect(
                launchpadReducer( undefined, {
                    type: TYPES.UPDATE_LAUNCHPAD
                } ).launchpad.isUpdating
            ).toBeFalsy();
        } );

        it( 'Should update only when new update available', () => {
            const store = { ...initialState };
            store.launchpad.hasUpdate = true;
            store.launchpad.newVersion = '0.12.0';
            expect(
                launchpadReducer( store, {
                    type: TYPES.UPDATE_LAUNCHPAD
                } ).launchpad.isUpdating
            ).toBeTruthy();
        } );

        it( 'Should not set the new version when no new update available', () => {
            const store = { ...initialState };
            store.launchpad.hasUpdate = false;
            store.launchpad.newVersion = '0.12.0';
            expect(
                launchpadReducer( store, {
                    type: TYPES.UPDATE_LAUNCHPAD
                } ).launchpad.isUpdating
            ).toBeFalsy();
        } );

        it( 'Should stop updating on any failure', () => {
            const store = { ...initialState };
            store.launchpad.isUpdating = true;
            store.launchpad.hasUpdate = true;
            store.launchpad.newVersion = '0.12.0';

            expect(
                launchpadReducer( store, {
                    type: `${TYPES.UPDATE_LAUNCHPAD}_FAILURE`
                } ).launchpad.isUpdating
            ).toBeFalsy();
        } );

        it( 'Should reset to initial state on launchpad update success', () => {
            const store = { ...initialState };
            store.launchpad.isUpdating = true;
            store.launchpad.hasUpdate = true;
            store.launchpad.newVersion = '0.12.0';

            const launchpadStore = launchpadReducer( store, {
                type: `${TYPES.UPDATE_LAUNCHPAD}_SUCCESS`
            } ).launchpad;
            expect( launchpadStore.isUpdating ).toBeFalsy();
            expect( launchpadStore.hasUpdate ).toBeFalsy();
            expect( launchpadStore.newVersion ).toEqual( null );
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

            expect(
                launchpadReducer( store, {
                    type: TYPES.PUSH_NOTIFICATION,
                    payload: {
                        notification: { ...newNotification }
                    }
                } ).notifications[newNotification.id].type
            ).toEqual( newNotification.type );
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
            ).toThrow();
        } );
    } );

    describe( 'DISMISS_NOTIFICATION', () => {
        let newStore = null;
        const notification = {
            type: 'ALERT',
            priority: 'HIGH',
            appId: generateRandomString(),
            id: generateRandomString()
        };
        beforeAll( () => {
            const store = { ...initialState };
            newStore = launchpadReducer( store, {
                type: TYPES.PUSH_NOTIFICATION,
                payload: {
                    notification: { ...notification }
                }
            } );
        } );

        it( 'Should throw if notification ID not set', () => {
            expect( () =>
                launchpadReducer( newStore, {
                    type: TYPES.DISMISS_NOTIFICATION,
                    payload: {}
                } )
            ).toThrow();
        } );

        it( 'Should remove notification based on ID', () => {
            expect(
                launchpadReducer( newStore, {
                    type: TYPES.DISMISS_NOTIFICATION,
                    payload: {
                        notificationId: notification.id
                    }
                } ).notifications[notification.id]
            ).toBeUndefined();
        } );
    } );
} );
