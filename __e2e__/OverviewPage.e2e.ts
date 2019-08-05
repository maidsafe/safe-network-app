import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl, getPageTitle } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Overview Page`.page( '../app/app.html' ).beforeEach( async () => {
    await waitForReact();
} );
// .afterEach( assertNoConsoleErrors );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launchpad' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

// we start as a tray window right now
test( 'clicking on window-switch button switches to normal window', async ( t ) => {
    await t.click( Selector( 'button.Overview__btn--upper-right' ) );
    await t
        .expect(
            Selector( 'span' ).withAttribute( 'data-istraywindow', 'false' ).exists
        )
        .ok();
} );

test( 'clicking on a vert icon in application overview shows menu items', async ( t ) => {
    await t
        .click( Selector( '.MeatballMenu__vertIcon' ) )
        .expect( Selector( '.MuiMenu-list' ).exists )
        .ok();
} );
