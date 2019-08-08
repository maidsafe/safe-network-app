import * as launchpad from '$Actions/launchpad_actions';
import * as launchpadHelper from '$Actions/helpers/launchpad';
import { generateRandomString } from '$Utils/app_utils';

describe( 'Launchpad actions', () => {
    it( 'should have types', () => {
        expect( launchpad.TYPES ).toBeDefined();
    } );

    it( 'should push notification', () => {
        const payload = {
            id: generateRandomString(),
            type: 'UPDATE_AVAILABLE',
            priority: 'HIGH'
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

    it( 'should set app preferences', () => {
        const payload = {
            appPreferences: {
                shouldOnboard: true
            }
        };
        const expectAction = {
            type: launchpad.TYPES.SET_APP_PREFERENCES,
            payload
        };
        expect( launchpad.setAppPreferences( payload ) ).toEqual( expectAction );
    } );

    it( 'should set on-boarding completed', async () => {
        const expectAction = {
            type: launchpad.TYPES.ONBOARD_COMPLETED
        };

        expect( launchpad.onboardCompleted ).toBeDefined();

        expect( launchpad.onboardCompleted() ).toEqual( expectAction );
    } );

    it( 'should create action to indicate window visibility', () => {
        const payload = {
            isVisible: true
        };
        const expectAction = {
            type: launchpad.TYPES.SET_AS_TRAY_WINDOW,
            payload
        };
        expect( launchpad.setAsTrayWindow( payload ) ).toEqual( expectAction );
    } );
} );
