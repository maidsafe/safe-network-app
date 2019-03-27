import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl } from './helpers';

declare const document;
const getPageTitle = ClientFunction( () => document.title );

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Home Page`.page( '../../app/app.html' ).afterEach( assertNoConsoleErrors );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launch Pad!' );
} );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launch Pad!' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);
