/* eslint import/prefer-default-export: off */
import { ClientFunction, Selector } from 'testcafe';
import * as fs from 'fs-extra';

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
export const getPageTitle = ClientFunction( () => document.title );

export const getByAria = Selector( ( label ) => {
    return document.querySelector( `[aria-label='${label}']` );
} );
export const getAllByAria = Selector( ( label ) => {
    return document.querySelectorAll( `[aria-label='${label}']` );
} );

export const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    // eslint-disable-next-line no-console
    if ( error && error.length > 0 ) {
        console.log( 'found errors:', error );
    }
    await t.expect( error ).eql( [] );
};
