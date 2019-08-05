import { ipcRenderer } from 'electron';
import AutoLaunch from 'auto-launch';

import pkg from '$Package';
import { UserPreferences } from '$Definitions/application.d';
import { userPreferenceDatabase } from './user_preferences_db';

export const mockPromise = (data = null) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });

export const fetchUserPreferencesLocally = () =>
    new Promise(async (resolve, reject) => {
        try {
            if (!userPreferenceDatabase.isReady()) {
                await userPreferenceDatabase.init();
            }
            const [userPreferences] = await userPreferenceDatabase.getAll();
            delete userPreferences.id;
            return resolve(userPreferences);
        } catch (error) {
            return reject(error);
        }
    });

export const storeUserPreferencesLocally = (userPreferences: UserPreferences) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!userPreferenceDatabase.isReady()) {
                await userPreferenceDatabase.init();
            }
            await userPreferenceDatabase.updatePreferences(userPreferences);
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });

export const checkOnBoardingCompleted = () => mockPromise(true);

export const autoLaunchOnStart = (enable) =>
    new Promise(async (resolve) => {
        try {
            const launchpadAutoLaunch = new AutoLaunch({
                name: pkg.name
            });
            const isEnabled = await launchpadAutoLaunch.isEnabled();
            if (!isEnabled && enable) {
                await launchpadAutoLaunch.enable();
                return resolve();
            }

            if (isEnabled) {
                await launchpadAutoLaunch.disable();
            }
            return resolve();
        } catch (error) {
            // TODO: Show error notification
            return resolve();
        }
    });

export const pinLaunchpadToTray = (enable) => {
    if (enable) {
        ipcRenderer.send('pinToTray');
    } else {
        ipcRenderer.send('releaseFromTray');
    }
};
