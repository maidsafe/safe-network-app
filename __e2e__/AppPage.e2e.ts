import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { assertNoConsoleErrors, getPageTitle } from './helpers';

fixture`Application Page`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', `Skip OnBoard App`] );
        await waitForReact();
    } )
    .afterEach( async ( t ) => {
        await assertNoConsoleErrors( t );
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', 'Reset application list'] );
    } );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Network App' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

// we start as a tray window right now
test( 'can navigate to the application page and install', async ( t ) => {
    await t.click(
        Selector( 'div' ).withAttribute( 'aria-label', 'List SAFE Browser' )
    );
    await t.expect( Selector( 'h6' ).withText( 'SAFE Browser' ).exists ).ok();

    await t
        .expect(
            Selector( 'h2.MuiTypography-caption' ).withText( 'Maidsafe Ltd.' )
                .exists
        )
        .ok();

    await t
        .expect(
            Selector( 'button' ).withAttribute(
                'aria-label',
                'Application Action Button'
            ).exists
        )
        .ok();

    const actionButton = Selector( 'button' ).withAttribute(
        'aria-label',
        'Application Action Button'
    );
    const progress = Selector( '.MuiCircularProgress-root' );

    await t
        .expect( actionButton.innerText )
        .eql( 'INSTALL' )
        .click( actionButton )
        .expect(
            actionButton.find( 'svg' ).withAttribute( 'aria-label', 'Pause Button' )
                .exists
        )
        .ok()
        .expect( progress.exists )
        .ok()
        .expect( actionButton.innerText )
        .eql( 'OPEN' );
} );
