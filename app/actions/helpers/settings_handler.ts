import fs from 'fs-extra';
import path from 'path';
import { logger } from '$Logger';
import pkg from '$Package';

import { Preferences } from '$Definitions/application.d';

import {
    defaultPreferences,
    settingsHandlerName,
    isRunningTestCafeProcess,
    getAppFolderPath
} from '$Constants/index';

class SettingsHandler {
    private preferenceId: number | null;

    private jsonFileName: string;

    constructor() {
        this.preferenceId = null;
        this.jsonFileName = isRunningTestCafeProcess
            ? settingsHandlerName.test
            : settingsHandlerName.production;
    }

    private getJsonPath() {
        try {
            let appFolderPath = getAppFolderPath();

            appFolderPath = path.resolve(
                appFolderPath,
                pkg.name,
                `${this.jsonFileName}.json`
            );

            fs.ensureFile( appFolderPath, ( error ) => {
                if ( error ) logger.error( error );
            } );

            return appFolderPath;
        } catch ( error ) {
            console.log( 'error', error );
            return error;
        }
    }

    public async updatePreferences( preferences: Preferences ) {
        const appFolderPath = await this.getJsonPath();
        fs.outputJsonSync( appFolderPath, { ...preferences } );
    }

    public async getPreferences(): Promise<Preferences> {
        const appFolderPath = this.getJsonPath();
        return fs.readJsonSync( appFolderPath );
    }
}

export const settingsHandler = new SettingsHandler();
