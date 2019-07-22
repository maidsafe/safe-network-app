import fs from 'fs';
import path from 'path';
import db from 'electron-db';
import pkg from '$Package';

import {
    Preferences,
    UserPreferences,
    AppPreferences
} from '$Definitions/application.d';
import {
    defaultPreferences,
    preferenceDatabaseName,
    isRunningTestCafeProcess
} from '$Constants/index';
import { getAppFolderPath, databaseCallBackHandler } from '$Utils/app_utils';

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

    private checkDatabaseExist() {
        try {
            const appFolderPath = getAppFolderPath();
            return fs.existsSync(
                path.resolve( appFolderPath, pkg.name, `${this.tableName}.json` )
            );
        } catch ( error ) {
            return false;
        }
    }

    private createTable() {
        return new Promise( async ( resolve, reject ) => {
            db.createTable(
                this.tableName,
                databaseCallBackHandler( resolve, reject )
            );
        } );
    }

    private storeInitialData( preferences: Preferences ) {
        return new Promise( async ( resolve, reject ) => {
            try {
                db.insertTableContent(
                    this.tableName,
                    preferences,
                    databaseCallBackHandler( resolve, reject )
                );
            } catch ( error ) {
                reject( new Error( 'Database corrupted' ) );
            }
        } );
    }

    private setup() {
        return new Promise( async ( resolve, reject ) => {
            try {
                // create application folder
                await PreferencesDatabase.createApplicationFolder();
                // create user preferences table
                await this.createTable();
                // insert initial user preferences data
                const initialPreferences: Preferences = {
                    ...defaultPreferences
                };
                await this.storeInitialData( initialPreferences );
                // initialize
                await this.init();
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    private getPreferences(): Promise<Preferences> {
        return new Promise( async ( resolve, reject ) => {
            const resolver = ( data ) => {
                const [preferences] = data;
                return resolve( preferences );
            };
            db.getAll(
                this.tableName,
                databaseCallBackHandler( resolver, reject )
            );
        } );
    }

    private updatePreferences( preferences: Preferences ) {
        // eslint-disable-next-line consistent-return
        return new Promise( async ( resolve, reject ) => {
            if ( !this.preferenceId ) {
                await this.init();
            }
            const where = {
                id: this.preferenceId
            };

            db.updateRow(
                this.tableName,
                where,
                preferences,
                databaseCallBackHandler( resolve, reject )
            );
        } );
    }

    public getUserPreferences(): Promise<UserPreferences> {
        return new Promise( async ( resolve, reject ) => {
            try {
                const preferences: Preferences = await this.getPreferences();
                return resolve( preferences.userPreferences );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public getAppPreferences(): Promise<AppPreferences> {
        return new Promise( async ( resolve, reject ) => {
            try {
                const preferences = await this.getPreferences();
                return resolve( preferences.appPreferences );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public updateUserPreferences( userPreferences: UserPreferences ) {
        return new Promise( async ( resolve, reject ) => {
            try {
                const preferences = await this.getPreferences();
                if ( !preferences ) {
                    return reject(
                        new Error( 'Unable to update user preferences' )
                    );
                }
                preferences.userPreferences = { ...userPreferences };

                await this.updatePreferences( preferences );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public updateAppPreferences( appPreferences: AppPreferences ) {
        return new Promise( async ( resolve, reject ) => {
            try {
                const preferences = await this.getPreferences();
                if ( !preferences ) {
                    return reject(
                        new Error( 'Unable to update app preferences' )
                    );
                }
                preferences.appPreferences = { ...appPreferences };

                await this.updatePreferences( preferences );
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
                if ( !this.checkDatabaseExist() ) {
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
