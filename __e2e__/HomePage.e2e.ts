// eslint-disable-next-line import/no-extraneous-dependencies
import { ClientFunction, Selector } from 'testcafe';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle, updatePreferences } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Home Page`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
    } )
    .afterEach( async () => {
        await updatePreferences( {
            appPreferences: {
                shouldOnboard: false
            }
        } );
    } );
// .afterEach( assertNoConsoleErrors );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launchpad' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

// TODO: How to test alternate BrowserWindow?
// https://github.com/DevExpress/testcafe/issues/912
// test( 'clicking on window-switch button switches to tray window', async ( t ) => {
//     await t.click( Selector( 'button.Overview__btn--upper-right' ) );
//     await t.expect( Selector( 'span' ).withAttribute( 'data-visible', 'false' ).exists ).ok();
// } );
