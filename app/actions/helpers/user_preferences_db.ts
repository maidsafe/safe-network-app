import fs from 'fs';
import db from 'electron-db';
import { UserPreferences } from '$Definitions/application.d';
import { getAppFolderPath, databaseCallBackHandler } from '$Utils/app_utils';

class UserPreferencesDatabase {
    private userPreferenceId: UserPreferences | null;

    private tableName: string;

    public constructor() {
        this.userPreferenceId = null;
        this.tableName = 'userPreferences';
    }

    private static createApplicationFolder() {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = getAppFolderPath();
            if ( !appFolderPath ) {
                return reject(
                    new Error( 'Unable to fetch application folder path' )
                );
            }
            try {
                if ( !fs.existsSync( appFolderPath ) ) fs.mkdirSync( appFolderPath );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
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
            db.insertTableContent(
                this.tableName,
                userPreferences,
                databaseCallBackHandler( resolve, reject )
            );
        } );
    }

    public setup() {
        return new Promise( async ( resolve, reject ) => {
            try {
                // create application folder
                await UserPreferencesDatabase.createApplicationFolder();
                // create user preferences table
                await this.createTable();
                // insert initial user preferences data
                const initialUserPreferences: UserPreferences = {
                    autoUpdate: false,
                    pinToMenuBar: false,
                    launchOnStart: false,
                    showDeveloperApps: false,
                    warnOnAccessingClearnet: false
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

    public canUpdate() {
        return !!this.userPreferenceId;
    }

    public init() {
        return new Promise( async ( resolve, reject ) => {
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
