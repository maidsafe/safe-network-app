import * as appManager from '$Actions/app_manager_actions';
import * as appActions from '$Actions/application_actions';
import { generateRandomString } from '$Utils/app_utils';

describe( 'Application Manager actions', () => {
    it( 'should have types', () => {
        expect( appManager.TYPES ).toBeDefined();
    } );

    it( 'should set applications', () => {
        expect( appManager.setApps ).toBeDefined();
        expect( appManager.setApps().type ).toEqual( appManager.TYPES.SET_APPS );
    } );

    it( 'should cancel application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appManager.cancelAppDownloadAndInstallation( payload ) ).toEqual(
            expectAction
        );
    } );

    it( 'should pause application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appManager.pauseAppDownloadAndInstallation( payload ) ).toEqual(
            expectAction
        );
    } );

    it( 'should retry application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.RETRY_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appManager.retryAppDownloadAndInstallation( payload ) ).toEqual(
            expectAction
        );
    } );

    it( 'should reset application store', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.RESET_APP_STATE,
            payload
        };
        expect( appManager.resetAppState( payload ) ).toEqual( expectAction );
    } );

    it( 'should update application description', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appActions.TYPES.SET_NEXT_RELEASE_DESCRIPTION,
            payload
        };
        expect( appActions.setNextReleaseDescription( payload ) ).toEqual(
            expectAction
        );
    } );
} );
