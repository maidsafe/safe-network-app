import * as launchpad from '$Actions/launcher_actions';
import { generateRandomString } from '$Utils/app_utils';

describe( 'Launchpad actions', () => {
    it( 'should have types', () => {
        expect( launchpad.TYPES ).toBeDefined();
    } );

    it( 'should push notification', () => {
        const payload = {
            id: generateRandomString(),
            type: 'UPDATE_AVAILABLE',
            priority: 'HIGH',
            appId: generateRandomString()
        };
        const expectAction = {
            type: launchpad.TYPES.PUSH_NOTIFICATION,
            payload
        };
        expect( launchpad.pushNotification( payload ) ).toEqual( expectAction );
    } );

    it( 'should dismiss notification', () => {
        const payload = {
            notificationId: generateRandomString()
        };
        const expectAction = {
            type: launchpad.TYPES.DISMISS_NOTIFICATION,
            payload
        };
        expect( launchpad.dismissNotification( payload ) ).toEqual( expectAction );
    } );

    it( 'should set user preferences', () => {
        const payload = {
            userPreferences: {
                autoUpdate: true,
                pinToMenuBar: true,
                launchOnStart: true,
                showDeveloperApps: true,
                warnOnAccessingClearnet: true
            }
        };
        const expectAction = {
            type: launchpad.TYPES.SET_USER_PREFERENCES,
            payload
        };
        expect( launchpad.setUserPreferences( payload ) ).toEqual( expectAction );
    } );

    it( 'should check onboarding process completed', () => {
        expect( launchpad.shouldOnboard ).toBeDefined();
        expect( launchpad.shouldOnboard().meta.trigger ).toEqual(
            launchpad.TYPES.SHOULD_ONBOARD
        );
    } );
} );
