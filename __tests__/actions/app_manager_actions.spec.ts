import * as appManager from '$Actions/app_manager_actions';
import * as appActions from '$Actions/application_actions';
import { generateRandomString } from '$Utils/app_utils';

describe( 'Application Manager actions', () => {
    it( 'should have types', () => {
        expect( appManager.TYPES ).toBeDefined();
        expect( appActions.TYPES ).toBeDefined();
    } );

    it( 'should update an application i', () => {
        expect( appManager.updateAppInfoIfNewer ).toBeDefined();
        expect( appManager.updateAppInfoIfNewer().type ).toEqual(
            appManager.TYPES.UPDATE_APP_INFO_IF_NEWER
        );
    } );

    it( 'should cancel application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appActions.TYPES.CANCEL_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appActions.cancelAppDownloadAndInstallation( payload ) ).toEqual(
            expectAction
        );
    } );

    it( 'should pause application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appActions.TYPES.PAUSE_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appActions.pauseAppDownloadAndInstallation( payload ) ).toEqual(
            expectAction
        );
    } );

    it( 'should retry application installation', () => {
        const payload = {
            id: generateRandomString()
        };
        const expectAction = {
            type: appActions.TYPES.RESUME_APP_DOWNLOAD_AND_INSTALLATION,
            payload
        };
        expect( appActions.resumeAppDownloadAndInstallation( payload ) ).toEqual(
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
} );
