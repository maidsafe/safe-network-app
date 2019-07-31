import fs from 'fs';
import path from 'path';
import * as fse from 'fs-extra';
import pkg from '$Package';

import { Preferences } from '$Definitions/application.d';
import {
    defaultPreferences,
    preferenceDatabaseName,
    isRunningTestCafeProcess
} from '$Constants/index';
import { getAppFolderPath } from '$Utils/app_utils';

class PreferencesDatabase {
    private preferenceId: number | null;

    private tableName: string;

    public constructor() {
        this.preferenceId = null;
        this.tableName = isRunningTestCafeProcess
            ? preferenceDatabaseName.test
            : preferenceDatabaseName.production;
    }

    private static createApplicationFolder() {
        return new Promise( async ( resolve, reject ) => {
            let appFolderPath = getAppFolderPath();
            if ( !appFolderPath ) {
                return reject(
                    new Error( 'Unable to fetch application folder path' )
                );
            }
            appFolderPath = path.resolve( appFolderPath, pkg.name );
            try {
                if ( !fs.existsSync( appFolderPath ) ) fs.mkdirSync( appFolderPath );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    private checkJsonExist() {
        try {
            const appFolderPath = getAppFolderPath();
            return fs.existsSync(
                path.resolve( appFolderPath, pkg.name, `${this.tableName}.json` )
            );
        } catch ( error ) {
            return false;
        }
    }

    private getJsonPath() {
        try {
            let appFolderPath = getAppFolderPath();
            if ( !appFolderPath ) {
                // eslint-disable-next-line no-new
                new Error( 'Unable to fetch application folder path' );
            }
            appFolderPath = path.resolve(
                appFolderPath,
                pkg.name,
                `${this.tableName}.json`
            );
            return appFolderPath;
        } catch ( error ) {
            console.log( 'error', error );
            return error;
        }
    }

    public updatePreferences( preferences: Preferences ) {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = this.getJsonPath();
            try {
                fse.outputJson( appFolderPath, { ...preferences } );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public getPreferences(): Promise<Preferences> {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = await this.getJsonPath();
            try {
                return resolve( fse.readJson( appFolderPath ) );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    private setup() {
        return new Promise( async ( resolve, reject ) => {
            try {
                // create application folder
                await PreferencesDatabase.createApplicationFolder();
                // insert initial user preferences data
                const initialPreferences: Preferences = {
                    ...defaultPreferences
                };
                await this.updatePreferences( initialPreferences );
                // initialize
                await this.init();
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public init() {
        return new Promise( async ( resolve, reject ) => {
            if ( this.preferenceId ) {
                return resolve();
            }
            try {
                if ( !this.checkJsonExist() ) {
                    await this.setup();
                }

                const preferences = await this.getPreferences();
                if ( preferences ) {
                    this.preferenceId = preferences.id;
                }
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }
}

export const preferenceDatabase = new PreferencesDatabase();
