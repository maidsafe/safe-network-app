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

    public updatePreferences( preferences: Preferences ) {
        return new Promise( ( resolve, reject ) => {
            const appFolderPath = this.getJsonPath();
            try {
                fs.outputJsonSync( appFolderPath, { ...preferences } );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public getPreferences(): Promise<Preferences> {
        return new Promise( ( resolve, reject ) => {
            const appFolderPath = await this.getJsonPath();
            try {
                return resolve( fs.readJsonSync( appFolderPath ) );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }
}

export const settingsHandler = new SettingsHandler();
