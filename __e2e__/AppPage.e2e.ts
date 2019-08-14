import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Application Page`.page( '../app/app.html' ).beforeEach( async () => {
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
test( 'can navigate to the application page.', async ( t ) => {
    await t.click(
        Selector( 'a' ).withAttribute( 'href', '#/application/safe.browser' )
    );
    await t.expect( Selector( 'h3' ).withText( 'SAFE Browser' ).exists ).ok();

    await t.expect( Selector( 'h4' ).withText( 'Maidsafe Ltd.' ).exists ).ok();

    await t
        .expect(
            Selector( 'button' ).withAttribute(
                'aria-label',
                'Application Action Button'
            ).exists
        )
        .ok();
} );
