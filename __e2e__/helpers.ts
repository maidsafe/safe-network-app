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
