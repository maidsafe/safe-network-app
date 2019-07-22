/* eslint import/prefer-default-export: off */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ClientFunction } from 'testcafe';
import * as db from 'electron-db';

import { databaseCallBackHandler } from '../app/utils/app_utils';

const preferenceDatabaseName = 'testPreferences';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
export const getPageTitle = ClientFunction( () => document.title );

export const updatePreferences = ( overridePreferences ) => {
    return new Promise( ( resolve, reject ) => {
        const tableName = preferenceDatabaseName;

        const updatePreference = ( preferences ) => {
            const where = {
                id: preferences.id
            };
            const newPreferences = Object.assign( {}, preferences );
            if ( overridePreferences.userPreferences ) {
                newPreferences.userPreferences = Object.assign(
                    newPreferences.userPreferences,
                    overridePreferences.userPreferences
                );
            }
            if ( overridePreferences.appPreferences ) {
                newPreferences.appPreferences = Object.assign(
                    newPreferences.appPreferences,
                    overridePreferences.appPreferences
                );
            }
            db.updateRow(
                tableName,
                where,
                newPreferences,
                databaseCallBackHandler( resolve, reject )
            );
        };

        const getAllCallback = ( success, data ) => {
            const [preferences] = data;
            updatePreference( preferences );
        };

        db.getAll( tableName, getAllCallback );
    } );
};
