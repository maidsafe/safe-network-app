import * as appManager from '$Actions/app_manager_actions';
import { generateRandomString } from '$Utils/app_utils';

describe('Application Manager actions', () => {
    it('should have types', () => {
        expect(appManager.TYPES).toBeDefined();
    });

    it('should set applications', () => {
        expect(appManager.setApps).toBeDefined();
        expect(appManager.setApps().type).toEqual(appManager.TYPES.SET_APPS);
    });

    it('should cancel application installation', () => {
        const payload = {
            appId: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.CANCEL_APP_INSTALLATION,
            payload
        };
        expect(appManager.cancelAppInstallation(payload)).toEqual(expectAction);
    });

    it('should pause application installation', () => {
        const payload = {
            appId: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.PAUSE_APP_INSTALLATION,
            payload
        };
        expect(appManager.pauseAppInstallation(payload)).toEqual(expectAction);
    });

    it('should retry application installation', () => {
        const payload = {
            appId: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.RETRY_APP_INSTALLATION,
            payload
        };
        expect(appManager.retryAppInstallation(payload)).toEqual(expectAction);
    });

    it('should reset application store', () => {
        const payload = {
            appId: generateRandomString()
        };
        const expectAction = {
            type: appManager.TYPES.RESET_APP_STATE,
            payload
        };
        expect(appManager.resetAppState(payload)).toEqual(expectAction);
    });
});
