import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle, getByAria } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`HeaderBar`.page( '../app/app.html' ).beforeEach( async () => {
    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', `Skip OnBoard App`] );
    await waitForReact();
} );
// .afterEach( assertNoConsoleErrors );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Network App' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

// we start as a tray window right now
test( 'can navigate back from another page.', async ( t ) => {
    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', 'Reset Preferences'] );

    const menu = getByAria( 'Header Menu' );
    const settingsMenuItem = getByAria( 'Go to Settings' );

    await t.click( menu ).click( settingsMenuItem );

    await t.click( Selector( 'h6.MuiTypography-subtitle2' ).withText( 'Settings' ) );

    await t.click( getByAria( 'Go Backwards' ) );
    await t.expect( getByAria( 'Go Backwards' ).exists ).notOk();
} );
