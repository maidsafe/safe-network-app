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
        const expectAction = {
            type: launchpad.TYPES.CHECK_SHOULD_ONBOARD,
            payload: Promise.resolve()
        };
        expect( launchpad.checkShouldOnboard ).toBeDefined();
        expect( launchpad.checkShouldOnboard() ).toEqual( expectAction );
    } );

    it( 'should initilise application', () => {
        const expectAction = {
            type: launchpad.TYPES.INITILISE_APP,
            payload: Promise.resolve()
        };
        expect( launchpad.initialiseApp ).toBeDefined();
        expect( launchpad.initialiseApp() ).toEqual( expectAction );
    } );

    it( 'should set on-boarding completed', async () => {
        const expectAction = {
            type: launchpad.TYPES.ONBOARD_COMPLETED
        };
        expect( launchpad.setOnboardCompleted ).toBeDefined();

        Object.defineProperty( launchpadHelper, 'storeAppPreferencesLocally', {
            value: jest.fn().mockImplementation( () => Promise.resolve() )
        } );
        const dispatch = jest.fn();
        launchpad.setOnboardCompleted()( dispatch );
        expect( dispatch ).toHaveBeenCalledWith( expectAction );
    } );
} );
