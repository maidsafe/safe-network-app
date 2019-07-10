import fs from 'fs';
import path from 'path';
import db from 'electron-db';
import pkg from '$Package';

import { UserPreferences } from '$Definitions/application.d';
import {
    defaultPreferences,
    preferenceDatabaseName,
    isRunningTestCafeProcess
} from '$Constants/index';
import { getAppFolderPath, databaseCallBackHandler } from '$Utils/app_utils';

class UserPreferencesDatabase {
    private userPreferenceId: UserPreferences | null;

    private tableName: string;

    public constructor() {
        this.userPreferenceId = null;
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

    private storeInitialData( userPreferences: UserPreferences ) {
        return new Promise( async ( resolve, reject ) => {
            try {
                db.insertTableContent(
                    this.tableName,
                    userPreferences,
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
                await UserPreferencesDatabase.createApplicationFolder();
                // create user preferences table
                await this.createTable();
                // insert initial user preferences data
                const initialUserPreferences: UserPreferences = {
                    ...defaultPreferences
                };
                await this.storeInitialData( initialUserPreferences );
                // initialize
                await this.init();
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public updatePreferences( userPreferences: UserPreferences ) {
        // eslint-disable-next-line consistent-return
        return new Promise( async ( resolve, reject ) => {
            if ( !this.userPreferenceId )
                return reject( new Error( 'Unable to update user preferences' ) );
            const where = {
                id: this.userPreferenceId
            };

            db.updateRow(
                this.tableName,
                where,
                userPreferences,
                databaseCallBackHandler( resolve, reject )
            );
        } );
    }

    public getAll(): Promise<Array<any>> {
        return new Promise( async ( resolve, reject ) => {
            db.getAll( this.tableName, databaseCallBackHandler( resolve, reject ) );
        } );
    }

    public isReady() {
        return !!this.userPreferenceId;
    }

    public init() {
        return new Promise( async ( resolve, reject ) => {
            if ( !this.checkDatabaseExist() ) {
                await this.setup();
            }
            try {
                const [userPreferences] = await this.getAll();
                if ( userPreferences ) {
                    this.userPreferenceId = userPreferences.id;
                }
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }
}

export const userPreferenceDatabase = new UserPreferencesDatabase();
