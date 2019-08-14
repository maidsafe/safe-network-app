import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`Overview Page`.page( '../app/app.html' ).beforeEach( async () => {
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

test( 'clicking on a vert icon in application overview shows menu items', async ( t ) => {
    await t
        .click( Selector( '.MeatballMenu__vertIcon' ) )
        .expect( Selector( '.MuiMenu-list' ).exists )
        .ok();
} );

test( 'clicking on install triggers install', async ( t ) => {
    const actionButton = Selector( 'button' ).withAttribute(
        'aria-label',
        'Application Action Button'
    );
    await t
        .click( actionButton )
        .expect( actionButton.innerText )
        .eql( 'OPEN' );
} );

test( 'clicking uninstall will uninstall', async ( t ) => {
    const actionButton = Selector( 'button' ).withAttribute(
        'aria-label',
        'Application Action Button'
    );

    await t
        .click( actionButton )
        .click( Selector( '.MeatballMenu__vertIcon' ) )
        .expect(
            Selector( 'li' ).withAttribute( 'aria-label', 'Uninstall SAFE Browser' )
                .exists
        )
        .ok();
} );
